import * as tts from "@diffusionstudio/vits-web";

type SetPlayingState = React.Dispatch<React.SetStateAction<boolean>>;
type SetLoadingState = React.Dispatch<React.SetStateAction<boolean>>;

export class SpeechService {
  private synthesis: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private setPlayingState: SetPlayingState | null = null;
  private setLoadingState: SetLoadingState | null = null;

  constructor(
    setPlayingState?: SetPlayingState,
    setLoadingState?: SetLoadingState
  ) {
    this.synthesis = window.speechSynthesis;
    this.setPlayingState = setPlayingState || null;
    this.setLoadingState = setLoadingState || null;
    this.initializeVoice();
  }

  private async initializeVoice() {
    if (!this.isSpeechSupported()) return;

    // Wait for voices to be loaded
    if (speechSynthesis.getVoices().length === 0) {
      await new Promise<void>((resolve) => {
        speechSynthesis.addEventListener("voiceschanged", () => resolve(), {
          once: true,
        });
      });
    }

    // Select an English male voice if available
    const voices = speechSynthesis.getVoices();
    this.voice =
      voices.find(
        (voice) =>
          voice.lang.startsWith("en") &&
          voice.name.toLowerCase().includes("male")
      ) ||
      voices.find((voice) => voice.lang.startsWith("en")) ||
      voices[0];
  }

  private isSpeechSupported(): boolean {
    return "speechSynthesis" in window;
  }

  private webSpeechSpeak(text: string): void {
    if (!this.isSpeechSupported() || !this.voice) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;

    // Update playing state to true when speech starts
    utterance.onstart = () => {
      this.setPlayingState?.(true);
    };

    // Update playing state to false when speech ends
    utterance.onend = () => {
      this.setPlayingState?.(false);
    };

    this.synthesis.speak(utterance);
  }

  private async ttsSpeak(text: string): Promise<void> {
    // Set loading state to true while generating the WAV file
    this.setLoadingState?.(true);

    try {
      const wav = await tts.predict({
        text,
        voiceId: "en_US-hfc_male-medium",
      });

      const audioUrl = URL.createObjectURL(wav);

      // Create an audio element and play it
      this.currentAudio = new Audio(audioUrl);

      // Update playing state to true when audio starts playing
      this.currentAudio.onplay = () => {
        this.setPlayingState?.(true);
        this.setLoadingState?.(false); // Loading is complete
      };

      // Update playing state to false when audio ends
      this.currentAudio.onended = () => {
        this.setPlayingState?.(false);
      };

      this.currentAudio.play();
    } catch (error) {
      console.error("Error generating or playing audio:", error);
      this.setLoadingState?.(false); // Ensure loading state is reset on error
    }
  }

  public async speak(text: string): Promise<void> {
    // Stop any ongoing audio before starting new speech
    if (this.isPlaying()) {
      this.stop();
    }

    if (this.isSpeechSupported()) {
      this.webSpeechSpeak(text);
    } else {
      await this.ttsSpeak(text);
    }
  }

  public pause(): void {
    if (this.isSpeechSupported()) {
      this.synthesis.pause();
    } else if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  public resume(): void {
    if (this.isSpeechSupported()) {
      this.synthesis.resume();
    } else if (this.currentAudio) {
      this.currentAudio.play();
    }
  }

  public stop(): void {
    if (this.isSpeechSupported()) {
      this.synthesis.cancel();
    } else if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    // Update playing state to false when audio is stopped
    this.setPlayingState?.(false);
    this.setLoadingState?.(false); // Ensure loading state is reset
  }

  public cancel(): void {
    this.stop();
  }

  public isPlaying(): boolean {
    if (this.isSpeechSupported()) {
      return this.synthesis.speaking || this.synthesis.paused;
    } else if (this.currentAudio) {
      return !this.currentAudio.paused && this.currentAudio.currentTime > 0;
    }
    return false;
  }
}