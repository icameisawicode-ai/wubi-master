import { useState, useEffect, useCallback, useRef } from 'react';
import HanziWriter from 'hanzi-writer';
import { charLibrary, WubiCharData, koujueDict } from '../data/wubiData';

export function useWubiGame() {
  const [currentTarget, setCurrentTarget] = useState<string>('王');
  const [gameData, setGameData] = useState<WubiCharData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputs, setInputs] = useState<string[]>(['', '', '', '']);
  const [completed, setCompleted] = useState(false);
  const [globalSpeed, setGlobalSpeed] = useState(1);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customQueue, setCustomQueue] = useState<string[]>([]);
  const [customIndex, setCustomIndex] = useState(0);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [isError, setIsError] = useState(false);

  const writerRef = useRef<HanziWriter | null>(null);

  const loadChar = useCallback((char: string) => {
    const data = charLibrary[char];
    if (data) {
      setCurrentTarget(char);
      setGameData(data);
      setCurrentIndex(0);
      setInputs(['', '', '', '']);
      setCompleted(false);
      setShowHint(null);
      setIsError(false);
    }
  }, []);

  const nextChar = useCallback(() => {
    const keys = Object.keys(charLibrary);
    const currentIndexInLibrary = keys.indexOf(currentTarget);
    const nextIdx = (currentIndexInLibrary + 1) % keys.length;
    loadChar(keys[nextIdx]);
  }, [currentTarget, loadChar]);

  const prevChar = useCallback(() => {
    const keys = Object.keys(charLibrary);
    const currentIndexInLibrary = keys.indexOf(currentTarget);
    const prevIdx = (currentIndexInLibrary - 1 + keys.length) % keys.length;
    loadChar(keys[prevIdx]);
  }, [currentTarget, loadChar]);

  const nextGroup = useCallback(() => {
    const keys = Object.keys(charLibrary);
    const currentNature = gameData?.nature;
    if (!currentNature) return;
    
    const currentIndexInLibrary = keys.indexOf(currentTarget);
    for (let i = currentIndexInLibrary + 1; i < keys.length; i++) {
      if (charLibrary[keys[i]].nature !== currentNature) {
        loadChar(keys[i]);
        return;
      }
    }
    loadChar(keys[0]);
  }, [currentTarget, gameData, loadChar]);

  const prevGroup = useCallback(() => {
    const keys = Object.keys(charLibrary);
    const currentNature = gameData?.nature;
    if (!currentNature) return;

    let firstOfCurrent = 0;
    for (let i = 0; i < keys.length; i++) {
      if (charLibrary[keys[i]].nature === currentNature) {
        firstOfCurrent = i;
        break;
      }
    }

    if (firstOfCurrent === 0) {
      const lastChar = keys[keys.length - 1];
      const lastNature = charLibrary[lastChar].nature;
      for (let i = 0; i < keys.length; i++) {
        if (charLibrary[keys[i]].nature === lastNature) {
          loadChar(keys[i]);
          return;
        }
      }
    } else {
      const prevGroupNature = charLibrary[keys[firstOfCurrent - 1]].nature;
      for (let i = 0; i < keys.length; i++) {
        if (charLibrary[keys[i]].nature === prevGroupNature) {
          loadChar(keys[i]);
          return;
        }
      }
    }
  }, [currentTarget, gameData, loadChar]);

  const handleInput = useCallback(async (index: number, key: string) => {
    if (!gameData || index !== currentIndex || completed) return;

    const lowerKey = key.toLowerCase();
    if (lowerKey === gameData.codes[index]) {
      const newInputs = [...inputs];
      newInputs[index] = lowerKey;
      setInputs(newInputs);
      
      // Emit event for animation
      const event = new CustomEvent('wubi-animation', {
        detail: {
          index,
          key: lowerKey,
          strokes: gameData.strokes[index] || []
        }
      });
      window.dispatchEvent(event);

      const nextIdx = index + 1;
      if (nextIdx >= gameData.codes.length) {
        setCompleted(true);
      } else {
        setCurrentIndex(nextIdx);
      }
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    }
  }, [gameData, currentIndex, completed, inputs]);

  const triggerHint = useCallback(() => {
    if (completed || !gameData) return;
    setShowHint(currentIndex);
    setTimeout(() => setShowHint(null), 1000);
  }, [completed, gameData, currentIndex]);

  useEffect(() => {
    loadChar('王');
  }, [loadChar]);

  return {
    currentTarget,
    gameData,
    currentIndex,
    inputs,
    completed,
    globalSpeed,
    setGlobalSpeed,
    isCustomMode,
    setIsCustomMode,
    setCustomQueue,
    setCustomIndex,
    nextChar,
    prevChar,
    nextGroup,
    prevGroup,
    handleInput,
    triggerHint,
    isError,
    showHint,
    loadChar
  };
}
