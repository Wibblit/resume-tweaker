'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ErrorToastHandler({ errorMessage }: { errorMessage: string }) {
  const { toast } = useToast();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Automatically "click" the button on render
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.click(); // Trigger the button click programmatically
    }
  }, []);

  const handleClick = () => {
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      style={{ display: 'none' }} // Make the button invisible
    >
      Trigger Toast
    </button>
  );
}
