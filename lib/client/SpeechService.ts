import * as tts from "@diffusionstudio/vits-web";

type SetPlayingState = React.Dispatch<React.SetStateAction<boolean>>;
type SetLoadingState = React.Dispatch<React.SetStateAction<boolean>>;
type VoiceReadyCallback = () => void;

export class SpeechService {
  private synthesis: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private setPlayingState: SetPlayingState | null = null;
  private setLoadingState: SetLoadingState | null = null;
  private isChrome: boolean = false;
  private voiceReadyCallback: VoiceReadyCallback | null = null;

  constructor(
    setPlayingState?: SetPlayingState,
    setLoadingState?: SetLoadingState,
    voiceReadyCallback?: VoiceReadyCallback
  ) {
    this.synthesis = window.speechSynthesis;
    this.setPlayingState = setPlayingState || null;
    this.setLoadingState = setLoadingState || null;
    this.isChrome =
      navigator.userAgent.toLowerCase().includes("chrome") &&
      !!window.chrome &&
      (!!window.chrome.webstore || !!window.chrome.runtime);
    this.voiceReadyCallback = voiceReadyCallback || null;
  }

  public async initialize(): Promise<void> {
    if (this.isChrome && this.isSpeechSupported()) {
      await this.selectVoice();
    }
  }

  private async selectVoice(): Promise<void> {
    return new Promise(async (resolve) => {
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener(
          "voiceschanged",
          () => this.handleVoicesLoaded(resolve),
          { once: true }
        );
      } else {
        await this.handleVoicesLoaded(resolve);
      }
    });
  }

  private async handleVoicesLoaded(resolve: () => void): Promise<void> {
    const voices = speechSynthesis.getVoices();
    this.voice =
      voices.find(
        (voice) =>
          voice.lang.startsWith("en") &&
          voice.name.toLowerCase().includes("female")
      ) ||
      voices.find((voice) => voice.lang.startsWith("en")) ||
      voices[0];

    this.voiceReadyCallback?.();
    resolve();
  }

  public isSpeechSupported(): boolean {
    return "speechSynthesis" in window;
  }

  private webSpeechSpeak(text: string): void {
    if (!this.isSpeechSupported() || !this.voice) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;
    utterance.lang = this.voice.lang;

    // Add error handling
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      this.setPlayingState?.(false);
    };

    utterance.onstart = () => {
      this.setPlayingState?.(true);
    };

    utterance.onend = () => {
      this.setPlayingState?.(false);
    };

    utterance.onpause = () => {
      this.setPlayingState?.(false);
    };

    this.synthesis.speak(utterance);
  }

  private async ttsSpeak(text: string): Promise<void> {
    this.setLoadingState?.(true);

    try {
      const wav = await tts.predict({
        text,
        voiceId: "en_US-hfc_male-medium",
      });

      const audioUrl = URL.createObjectURL(wav);
      this.currentAudio = new Audio(audioUrl);

      this.currentAudio.onplay = () => {
        this.setPlayingState?.(true);
        this.setLoadingState?.(false);
      };

      this.currentAudio.onended = () => {
        this.setPlayingState?.(false);
      };

      this.currentAudio.play();
    } catch (error) {
      console.error("Error generating or playing audio:", error);
      this.setLoadingState?.(false);
    }
  }

  public async speak(text: string): Promise<void> {
    if (this.isPlaying()) {
      this.stop();
    }

    if (this.isChrome && this.isSpeechSupported()) {
      this.webSpeechSpeak(text);
    } else {
      await this.ttsSpeak(text);
    }
  }

  public pause(): void {
    if (this.isChrome && this.isSpeechSupported()) {
      this.synthesis.pause();
    } else if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  public resume(): void {
    if (this.isChrome && this.isSpeechSupported()) {
      this.synthesis.resume();
    } else if (this.currentAudio) {
      this.currentAudio.play();
    }
  }

  public stop(): void {
    if (this.isChrome && this.isSpeechSupported()) {
      this.synthesis.cancel();
    } else if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    this.setPlayingState?.(false);
    this.setLoadingState?.(false);
  }

  public cancel(): void {
    this.stop();
  }

  public isPlaying(): boolean {
    if (this.isChrome && this.isSpeechSupported()) {
      return this.synthesis.speaking || this.synthesis.paused;
    } else if (this.currentAudio) {
      return !this.currentAudio.paused && this.currentAudio.currentTime > 0;
    }
    return false;
  }
}
