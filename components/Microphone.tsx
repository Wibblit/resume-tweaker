import { Button } from "./ui/button";
import { KaldiRecognizer } from "vosk-browser";
import MicrophoneStream from "microphone-stream";
import { useCallback, useEffect, useState } from "react";
import { AudioStreamer } from "@/public/audioStreamer";
import { audioBucket } from "./audiobucket";

interface MicroPhoneProps {
  recognizer: KaldiRecognizer;
  loading: boolean;
}

let micStream: any;
let audioStreamer: AudioStreamer;

export function MicroPhone({ recognizer, loading }: MicroPhoneProps) {
  const [muted, setMuted] = useState(true);

  const startRecording = useCallback(async () => {
    console.log("reached")
    if (!recognizer) return;

    if (!muted) {
      setMuted(false);
      return;
    }


    if (recognizer) {
      setMuted(false);

      if (!micStream) {
        let mediaStream = null;
        try {

          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
            },
          });

          micStream = new MicrophoneStream({
            objectMode: true,
            bufferSize: 1024,
          });
          micStream.setStream(mediaStream);

          micStream.on("data", (chunk:any) => recognizer.acceptWaveform(chunk));
        } catch (error) {
          console.error("error: ", error);
        }
      } else {
        micStream.unpipe(audioStreamer);
        micStream.pipe(audioBucket);
      }
    }
  }, [recognizer]);

  useEffect(() => {
    setMuted(true);
  }, [loading]);

  return (
    <div>
      <Button onClick={startRecording}>
        {muted ? "Start Recording" : "Stop Recording"}
      </Button>
    </div>
  );
}
