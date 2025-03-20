import * as tts from "@diffusionstudio/vits-web";

class AppService {
  private setIsTimerPaused: (value: boolean) => void;
  private setAudioQueue: (value: (prev: string[]) => string[]) => void;
  private usingModelTTS: boolean;

  constructor(
    setIsTimerPaused: (value: boolean) => void,
    setAudioQueue: (value: (prev: string[]) => string[]) => void,
    usingModelTTS: boolean
  ) {
    this.setIsTimerPaused = setIsTimerPaused;
    this.setAudioQueue = setAudioQueue;
    this.usingModelTTS = usingModelTTS;
  }

  async generateAudio(question: string) {
    this.setIsTimerPaused(true);

    if (!this.usingModelTTS && "speechSynthesis" in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(question);
        utterance.onend = () => this.setIsTimerPaused(false);
        speechSynthesis.speak(utterance);
        return;
      } catch (error) {
        console.error("Error using built-in TTS:", error);
      }
    }

    // Fallback to model-based TTS
    try {
      const wav = await tts.predict({
        text: question,
        voiceId: "en_US-hfc_male-medium",
      });
      const audioUrl = URL.createObjectURL(wav);
      this.setAudioQueue((prevQueue) => [...prevQueue, audioUrl]);
    } catch (error) {
      console.error(`Error generating audio for question:`, error);
    } finally {
      this.setIsTimerPaused(false);
    }
  }
}

export default AppService;
