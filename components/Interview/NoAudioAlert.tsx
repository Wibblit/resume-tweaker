import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NoAudioAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NoAudioAlert({ isOpen, onClose }: NoAudioAlertProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>No Audio Recorded</AlertDialogTitle>
          <AlertDialogDescription>
            We couldn't find any recorded audio for your interview. Without any responses, we cannot evaluate your performance. Please ensure your microphone is working and try again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Understood</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
