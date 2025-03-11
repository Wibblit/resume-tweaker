import { useState, useEffect } from 'react';

export function useTypewriter(text: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    const timer = setInterval(() => {
      setDisplayedText((current) => {
        if (current.length === text.length) {
          clearInterval(timer);
          setIsComplete(true);
          return current;
        }
        return text.slice(0, current.length + 1);
      });
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isComplete };
}

