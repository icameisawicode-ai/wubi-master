import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Info, RotateCcw, X, Check, Keyboard, Coffee } from 'lucide-react';
import HanziWriter from 'hanzi-writer';
import { useWubiGame } from './hooks/useWubiGame';
import { koujueDict, codeToRoot, charLibrary } from './data/wubiData';
import { cn } from './lib/utils';

export default function App() {
  const {
    currentTarget,
    gameData,
    currentIndex,
    inputs,
    completed,
    globalSpeed,
    setGlobalSpeed,
    nextChar,
    prevChar,
    nextGroup,
    prevGroup,
    handleInput,
    triggerHint,
    isError,
    showHint,
    loadChar
  } = useWubiGame();

  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showKeyboardMap, setShowKeyboardMap] = useState(false);
  const [customText, setCustomText] = useState('');
  const writerContainerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const currentTargetRef = useRef(currentTarget);
  const themeColors = ['#ff5252', '#ffd740', '#448aff', '#e040fb'];

  useEffect(() => {
    currentTargetRef.current = currentTarget;
  }, [currentTarget]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      if (completed) {
        nextChar();
      } else {
        // If space is the expected code, handle it as input
        if (gameData && gameData.codes[currentIndex] === ' ') {
          handleInput(currentIndex, ' ');
        } else {
          triggerHint();
        }
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      loadChar(currentTarget);
    } else if (e.key.toLowerCase() === 'z') {
      e.preventDefault();
      setShowKeyboardMap(prev => !prev);
    } else if (/^[a-z]$/i.test(e.key)) {
      handleInput(currentIndex, e.key);
    }
  };

  const inputsRef = useRef(inputs);
  useEffect(() => {
    inputsRef.current = inputs;
    
    // Clear persistent layer on reset
    if (inputs.every(val => val === '')) {
      const pLayer = writerContainerRef.current?.querySelector('#persistent-layer');
      if (pLayer) pLayer.innerHTML = '';
    }
  }, [inputs]);

  useEffect(() => {
    const handleAnimation = async (e: any) => {
      const { index, key, strokes } = e.detail;
      const animatingChar = currentTarget; 
      if (!writerRef.current || !gameData) return;

      const cl = themeColors[index];
      const stage = writerContainerRef.current;
      if (!stage) return;

      // 1. Create the stroke SVG using a temporary writer
      const tempOverlay = document.createElement('div');
      tempOverlay.className = "absolute inset-0 pointer-events-none";
      stage.appendChild(tempOverlay);

      const { clientWidth, clientHeight } = stage;
      const tempWriter = HanziWriter.create(tempOverlay, animatingChar, {
        width: clientWidth,
        height: clientHeight,
        padding: 5,
        showOutline: false,
        showCharacter: false,
        strokeColor: cl,
        strokeAnimationSpeed: 200, // Make it very fast for the trace
      });

      // Render the specific strokes
      for (const strokeIdx of strokes) {
        await new Promise(resolve => tempWriter.animateStroke(strokeIdx, { 
          onComplete: resolve
        }));
      }

      // CHECK: If character changed during stroke animation, abort
      if (currentTargetRef.current !== animatingChar) {
        tempOverlay.remove();
        return;
      }

      const sourceSvg = tempOverlay.querySelector('svg');
      if (!sourceSvg) {
        tempOverlay.remove();
        return;
      }

      // 2. Create the Persistent Copy (Stays on the character)
      const pLayer = stage.querySelector('#persistent-layer');
      if (pLayer && currentTargetRef.current === animatingChar) {
        // Check if already exists to avoid duplicates from fast typing/retries
        if (!pLayer.querySelector(`[data-input-index="${index}"]`)) {
          const persistentCopy = sourceSvg.cloneNode(true) as HTMLElement;
          persistentCopy.setAttribute('data-input-index', index.toString());
          const path = persistentCopy.querySelector('path:last-child') as SVGPathElement;
          if (path) {
            path.style.stroke = themeColors[index];
            path.style.fill = themeColors[index];
            path.style.opacity = '1';
          }
          persistentCopy.style.position = 'absolute';
          persistentCopy.style.top = '0';
          persistentCopy.style.left = '0';
          persistentCopy.style.width = '100%';
          persistentCopy.style.height = '100%';
          pLayer.appendChild(persistentCopy);
        }
      }

      // 3. Create the "Soul" for flight animation
      const rect = sourceSvg.getBoundingClientRect();
      const ghost = sourceSvg.cloneNode(true) as HTMLElement;
      
      // Remove the temp overlay now that we have our copies
      tempOverlay.remove();

      ghost.style.position = 'fixed';
      ghost.style.left = `${rect.left}px`;
      ghost.style.top = `${rect.top}px`;
      ghost.style.width = `${rect.width}px`;
      ghost.style.height = `${rect.height}px`;
      ghost.style.zIndex = '1000';
      ghost.style.pointerEvents = 'none';
      ghost.style.transition = `all ${0.5 / globalSpeed}s cubic-bezier(0.4, 0, 0.2, 1)`;
      document.body.appendChild(ghost);

      // Step A: Fly to center, scale up, fade
      requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2 - rect.width / 2;
        const centerY = window.innerHeight / 2 - rect.height / 2;
        ghost.style.transform = `translate(${centerX - rect.left}px, ${centerY - rect.top}px) scale(1.5)`;
        ghost.style.opacity = '0.5';
      });

      // Step B: Stay at center
      await new Promise(resolve => setTimeout(resolve, 800 / globalSpeed));

      // CHECK: If character changed while at center, abort ghost flight
      if (currentTargetRef.current !== animatingChar) {
        ghost.remove();
        return;
      }

      // Step C: Fly to target box
      const targetBox = document.getElementById(`root-box-${index}`);
      if (targetBox) {
        const targetRect = targetBox.getBoundingClientRect();
        const tx = targetRect.left + targetRect.width / 2 - (rect.left + rect.width / 2);
        const ty = targetRect.top + targetRect.height / 2 - (rect.top + rect.height / 2);
        
        ghost.style.transform = `translate(${tx}px, ${ty}px) scale(0.2)`;
        ghost.style.opacity = '0';
      }

      await new Promise(resolve => setTimeout(resolve, 400 / globalSpeed));
      ghost.remove();
    };

    window.addEventListener('wubi-animation', handleAnimation);
    return () => window.removeEventListener('wubi-animation', handleAnimation);
  }, [currentTarget, globalSpeed, gameData]);

  const lastTargetRef = useRef<string>('');

  useEffect(() => {
    if (writerContainerRef.current) {
      const stage = writerContainerRef.current;
      const isNewTarget = lastTargetRef.current !== currentTarget;
      lastTargetRef.current = currentTarget;

      let pLayer = stage.querySelector('#persistent-layer');
      
      if (isNewTarget || !pLayer) {
        stage.innerHTML = '';
        pLayer = document.createElement('div');
        pLayer.id = 'persistent-layer';
        pLayer.className = 'absolute inset-0 pointer-events-none z-10';
        stage.appendChild(pLayer);
      } else {
        // If it's just a speed change, remove the old writer SVG but keep the persistent layer
        const svgs = stage.querySelectorAll('svg');
        svgs.forEach(svg => {
          if (!pLayer?.contains(svg)) {
            svg.remove();
          }
        });
      }

      const { clientWidth, clientHeight } = stage;
      const writer = HanziWriter.create(stage, currentTarget, {
        width: clientWidth,
        height: clientHeight,
        padding: 5,
        strokeColor: '#FFFFFF',
        outlineColor: 'rgba(255,255,255,0.1)',
        strokeAnimationSpeed: 0.8 * globalSpeed,
        showOutline: true,
        // @ts-ignore
        onLoadCharData: () => {
          if (!gameData || !pLayer) return;
          
          // Only restore if the persistent layer is empty but we have inputs
          if (pLayer.innerHTML === '') {
            inputsRef.current.forEach((val, i) => {
              if (val && gameData.strokes[i]) {
                gameData.strokes[i].forEach((strokeIdx) => {
                  const tempOverlay = document.createElement('div');
                  const tempWriter = HanziWriter.create(tempOverlay, currentTarget, {
                    width: clientWidth,
                    height: clientHeight,
                    padding: 5,
                    // @ts-ignore
                    onLoadCharData: () => {
                      tempWriter.animateStroke(strokeIdx, {
                        onComplete: () => {
                          const sourceSvg = tempOverlay.querySelector('svg');
                          if (sourceSvg) {
                            const persistentCopy = sourceSvg.cloneNode(true) as HTMLElement;
                            persistentCopy.setAttribute('data-input-index', i.toString());
                            const path = persistentCopy.querySelector('path:last-child') as SVGPathElement;
                            if (path) {
                              path.style.stroke = themeColors[i];
                              path.style.fill = themeColors[i];
                              path.style.opacity = '1';
                            }
                            persistentCopy.style.position = 'absolute';
                            persistentCopy.style.top = '0';
                            persistentCopy.style.left = '0';
                            persistentCopy.style.width = '100%';
                            persistentCopy.style.height = '100%';
                            pLayer?.appendChild(persistentCopy);
                          }
                          tempOverlay.remove();
                        }
                      });
                    }
                  });
                });
              }
            });
          }
        }
      });
      writerRef.current = writer;
      
      // Ensure persistent layer is on top
      if (pLayer) stage.appendChild(pLayer);
    }
  }, [currentTarget, globalSpeed]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSettings && !showAbout) {
      containerRef.current?.focus();
    }
  }, [showSettings, showAbout]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#2b4a3b] text-white font-sans flex flex-col items-center py-10 px-4 outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-2 flex items-center gap-3 text-[#e0f2f1]"
      >
        五笔拆字练习
        <span className="text-base font-normal opacity-60">v3.0.0</span>
      </motion.h1>

      <motion.div 
        id="game-container"
        animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={cn(
          "bg-[#365c4a] border-4 border-[#5d8a73] rounded-2xl p-8 shadow-2xl relative max-w-6xl w-full",
          isError && "bg-[#6b3030]"
        )}
      >
        <div className="flex flex-col items-center gap-16">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 w-full">
            {/* Hanzi Stage */}
            <div className="relative">
              <div 
                ref={writerContainerRef}
                className="w-[500px] h-[500px] border-4 border-dashed border-white/20 rounded-2xl bg-black/10 relative overflow-hidden shadow-inner flex-shrink-0"
              />
              {gameData?.nature && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-[#ffd740]">
                  {gameData.nature}
                </div>
              )}
              {gameData?.isSpecialCase && (
                <div className="absolute top-4 right-4 z-20 flex flex-col items-center">
                  <span className="text-red-500 text-2xl font-bold leading-none">*</span>
                  <span className="text-red-500 text-[10px] font-bold mt-[-2px]">特例</span>
                </div>
              )}
            </div>

            {/* Right Panel: Components & Mnemonics */}
            <div className="flex flex-col gap-6 min-w-[380px] justify-center py-4">
              {gameData?.nature === '(1/7) 键名字 - 单字根' && (
                <div className="mb-4 px-4 py-2 bg-black/20 rounded-lg border border-white/10">
                  <p className="text-[#ffd740] text-xs font-bold">
                    公式：[所在键] × 4
                  </p>
                </div>
              )}
              {gameData?.nature === '(2/7) 成字字根 - 单字根单笔划' && (
                <div className="mb-4 px-4 py-2 bg-black/20 rounded-lg border border-white/10">
                  <p className="text-[#ffd740] text-xs font-bold">
                    公式：[所在键] + [首笔码] + L + L
                  </p>
                </div>
              )}
              {gameData?.nature === '(3/7) 成字字根 - 单字根两笔划' && (
                <div className="mb-4 px-4 py-2 bg-black/20 rounded-lg border border-white/10">
                  <p className="text-[#ffd740] text-xs font-bold">
                    公式：[所在键] + [首笔码] + [次笔码] + [空格]
                  </p>
                </div>
              )}
              {gameData?.nature === '(4/7) 成字字根 - 单字根三笔划及以上' && (
                <div className="mb-4 px-4 py-2 bg-black/20 rounded-lg border border-white/10">
                  <p className="text-[#ffd740] text-xs font-bold">
                    公式：[所在键] + [首笔码] + [次笔码] + [末笔码]
                  </p>
                </div>
              )}
              {gameData?.nature === '(5/7) 双字根' && (
                <div className="mb-4 px-4 py-2 bg-black/20 rounded-lg border border-white/10">
                  <p className="text-[#ffd740] text-xs font-bold">
                    公式：[第一字根] + [第二字根] + [识别码]
                  </p>
                </div>
              )}
              {gameData?.nature === '(6/7) 三字根字' && (
                <div className="mb-4 px-4 py-2 bg-black/20 rounded-lg border border-white/10">
                  <p className="text-[#ffd740] text-xs font-bold">
                    公式：[第一字根] + [第二字根] + [第三字根] + [识别码]
                  </p>
                </div>
              )}
              {gameData?.nature === '(7/7) 四字根及以上' && (
                <div className="mb-4 px-4 py-2 bg-black/20 rounded-lg border border-white/10">
                  <p className="text-[#ffd740] text-xs font-bold">
                    公式：[第一字根] + [第二字根] + [第三字根] + [末字根]
                  </p>
                </div>
              )}
              {Array.from({ length: 4 }).map((_, i) => {
                const isFilled = inputs[i] !== '';
                const root = gameData?.roots[i] || '';
                const rawAnnotation = gameData?.annotations[i] || '';
                let annotation = rawAnnotation.startsWith('@') 
                  ? koujueDict[rawAnnotation.slice(1).toLowerCase()] || rawAnnotation 
                  : rawAnnotation;

                const code = gameData?.codes[i] || '';
                const upperCode = code.toUpperCase();
                const koujue = koujueDict[code.toLowerCase()] || '';

                const strokeToName: Record<string, string> = {
                  '一': '横', '丨': '竖', '亅': '竖', '丿': '撇', '丶': '捺', '乙': '折', '乚': '折'
                };

                // Category 1: (1/7) 键名字 - 单字根
                if (gameData?.nature === '(1/7) 键名字 - 单字根') {
                  if (i === 0) {
                    annotation = `键名${upperCode} ${koujue}`;
                  } else {
                    annotation = koujue;
                  }
                }

                // Category 2: (2/7) 成字字根 - 单字根单笔划
                if (gameData?.nature === '(2/7) 成字字根 - 单字根单笔划') {
                  if (i === 0) {
                    annotation = `键位${upperCode} ${koujue}`;
                  } else if (i === 1) {
                    const strokeChar = gameData.char;
                    const strokeName = strokeToName[strokeChar] || strokeChar;
                    annotation = `${strokeName}${upperCode} ${koujue}`;
                  }
                }

                // Category 3: (3/7) 成字字根 - 单字根两笔划
                if (gameData?.nature === '(3/7) 成字字根 - 单字根两笔划') {
                  if (i === 0) {
                    annotation = `键位${upperCode} ${koujue}`;
                  } else if (i === 1 || i === 2) {
                    const rootChar = gameData.roots[i];
                    const strokeName = strokeToName[rootChar] || rootChar;
                    annotation = `${strokeName}${upperCode} ${koujue}`;
                  }
                }

                // Category 4: (4/7) 成字字根 - 单字根三笔划及以上
                if (gameData?.nature === '(4/7) 成字字根 - 单字根三笔划及以上') {
                  if (i === 0) {
                    annotation = `键位${upperCode} ${koujue}`;
                  } else if (i >= 1 && i <= 3) {
                    const rootChar = gameData.roots[i];
                    const strokeName = strokeToName[rootChar] || rootChar;
                    annotation = `${strokeName}${upperCode} ${koujue}`;
                  }
                }

                // Category 5: (5/7) 双字根
                if (gameData?.nature === '(5/7) 双字根') {
                  if (i === 2) {
                    annotation = rawAnnotation;
                  }
                }

                // Category 6: (6/7) 三字根字
                if (gameData?.nature === '(6/7) 三字根字') {
                  if (i === 3) {
                    annotation = rawAnnotation;
                  }
                }

                return (
                  <div key={i} className="flex items-center gap-6 h-20">
                    <motion.div 
                      id={`root-box-${i}`}
                      initial={false}
                      animate={isFilled ? { scale: [0.8, 1.1, 1], opacity: 1 } : { scale: 1, opacity: 0.3 }}
                      className={cn(
                        "w-16 h-16 border-2 border-white/70 rounded-lg flex items-center justify-center text-4xl font-serif bg-white/5 transition-all flex-shrink-0",
                        isFilled && "bg-white/10"
                      )}
                      style={isFilled ? { 
                        borderColor: themeColors[i], 
                        color: themeColors[i],
                        backgroundColor: `${themeColors[i]}22`
                      } : {}}
                    >
                      {isFilled ? root : ''}
                    </motion.div>
                    
                    <AnimatePresence>
                      {isFilled && annotation && (
                        <motion.div 
                          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                          transition={{ 
                            duration: 2 / globalSpeed, 
                            ease: [0.4, 0, 0.2, 1] 
                          }}
                          className="text-2xl leading-tight text-white/90 drop-shadow-md flex-grow"
                          style={{ 
                            color: themeColors[i],
                            fontFamily: "'STXingkai', '华文行楷', cursive",
                            maxWidth: "14em"
                          }}
                        >
                          {annotation.split(/[，,]/).map((line, idx) => (
                            <React.Fragment key={idx}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls (Inputs & Actions) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center w-full">
            <div className="hidden lg:block" /> {/* Left spacer */}
            
            <div className="flex flex-col items-center">
              <div className="flex gap-4">
                {inputs.map((val, i) => {
                  const isTarget = i === currentIndex;
                  const isFilled = val !== '';
                  const isLocked = i >= (gameData?.codes.length || 0);
                  const isHinted = showHint === i;

                  return (
                    <div 
                      key={i}
                      className={cn(
                        "w-14 h-14 border-4 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300 relative",
                        isLocked ? "bg-white/5 border-white/10 opacity-30" : "bg-black/20 border-white",
                        isTarget && !isLocked && "ring-4 ring-offset-2 ring-offset-[#365c4a]",
                        isFilled && "bg-white/5"
                      )}
                      style={{ 
                        borderColor: isFilled ? themeColors[i] : (isTarget ? themeColors[i] : 'rgba(255,255,255,0.3)'),
                        color: isFilled ? themeColors[i] : (isHinted ? '#00e676' : 'transparent'),
                        boxShadow: isTarget ? `0 0 20px ${themeColors[i]}44` : 'none'
                      }}
                    >
                      {isFilled ? val.toUpperCase() : (isHinted ? gameData?.codes[i].toUpperCase() : '')}
                      {isTarget && !isLocked && !showSettings && !showAbout && !completed && (
                        <motion.div 
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="absolute w-0.5 h-8 rounded-full"
                          style={{ backgroundColor: themeColors[i] }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-white/40 text-xs tracking-widest flex items-center gap-2">
                <Keyboard size={14} />
                按空格键提示/下一题
              </p>
            </div>

            <div className="flex justify-center lg:justify-end gap-3 mt-8 lg:mt-0">
              <button 
                onClick={() => prevGroup()}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/20 border-l-4 border-l-[#00bcd4] rounded-lg hover:bg-white/15 transition-all text-sm"
              >
                上一组
              </button>
              <button 
                onClick={() => nextGroup()}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/20 border-l-4 border-l-[#00bcd4] rounded-lg hover:bg-white/15 transition-all text-sm"
              >
                下一组
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/20 border-l-4 border-l-[#ff9800] rounded-lg hover:bg-white/15 transition-all text-sm"
              >
                <Settings size={16} />
                设置
              </button>
              <button 
                onClick={() => setShowAbout(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/20 border-l-4 border-l-[#e91e63] rounded-lg hover:bg-white/15 transition-all text-sm"
              >
                <Info size={16} />
                关于
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showKeyboardMap && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white/5 border border-white/20 rounded-3xl p-4 overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setShowKeyboardMap(false)} 
                className="absolute top-6 right-6 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-4 text-[#00e676] flex items-center gap-2">
                  <Keyboard size={24} />
                  86版五笔字根键盘图
                </h3>
                <div className="w-full bg-white rounded-xl overflow-hidden">
                  <img 
                    src="https://i.postimg.cc/TwvF7pZs/wubi-Key-Board.png" 
                    alt="86版五笔字根表" 
                    className="w-full h-auto mix-blend-multiply filter contrast-125 brightness-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="mt-4 text-white/40 text-sm">
                  提示：再次按下 <span className="text-white/80 font-bold">Z</span> 键或点击关闭按钮退出
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#365c4a] border-4 border-[#5d8a73] rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#ff9800]">设置</h3>
                <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-black/20 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm opacity-80">动画速度 (移动与停留)</span>
                    <span className="text-[#00e676] font-bold">{globalSpeed}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="1" 
                    value={globalSpeed}
                    onChange={(e) => setGlobalSpeed(parseInt(e.target.value))}
                    className="w-full accent-[#00e676] cursor-pointer"
                  />
                  <p className="text-[10px] text-white/40 mt-2">
                    数值越大，动画移动越快，停留时间越短
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm opacity-80">自定义练习文字</label>
                  <textarea 
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="请粘贴文字，系统将提取支持的汉字..."
                    className="w-full h-32 bg-black/20 border-2 border-[#5d8a73] rounded-xl p-4 text-white outline-none focus:border-[#00e676] transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-2 bg-[#6b3030] rounded-lg hover:opacity-80 transition-all font-medium"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      const chars = customText.split('').filter(c => charLibrary[c]);
                      if (chars.length > 0) {
                        loadChar(chars[0]);
                      }
                      setShowSettings(false);
                    }}
                    className="px-6 py-2 bg-[#5d8a73] rounded-lg hover:opacity-80 transition-all font-medium"
                  >
                    保存并开始
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#365c4a] border-4 border-[#5d8a73] rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#ff9800]">关于</h3>
                <button onClick={() => setShowAbout(false)} className="text-white/50 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 text-white/90">
                <p className="font-bold text-[#ffd740]">主要功能：</p>
                <ul className="list-disc list-inside space-y-2 opacity-80 text-sm">
                  <li><span className="text-white font-bold">动画拆字：</span>实时演示汉字拆解过程，笔画飞入对应键位，直观理解字根构成。</li>
                  <li><span className="text-white font-bold">公式、口诀助记：</span>提供详细的拆解公式与五笔口诀，强化记忆，降低学习门槛。</li>
                  <li><span className="text-white font-bold">支持调速：</span>自由调节动画播放速度（1x-5x），适应不同阶段的学习节奏。</li>
                </ul>

                <div className="mt-8 p-6 bg-black/20 rounded-2xl text-center flex flex-col items-center gap-4">
                  <p className="text-xs text-[#ffd740] font-bold leading-relaxed">
                    ☕ 如果该项目对你有帮助，<br />欢迎支持作者，谢谢！
                  </p>
                  <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-lg">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=wxp://f2f0VrDfTEDhyvxsI1PcgJ51glCx0MyyGfz6fT6H_A4TdXI" 
                      alt="Donation QR"
                      className="w-full h-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button 
                    onClick={() => setShowAbout(false)}
                    className="px-8 py-2 bg-[#5d8a73] rounded-lg hover:opacity-80 transition-all font-medium"
                  >
                    确定
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
