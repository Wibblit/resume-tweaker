import * as tts from "@diffusionstudio/vits-web";

class AppService {
  private setIsTimerPaused: (value: boolean) => void;
  private setAudio: (value: string | null) => void;
  private setIsSpeaking: (value: boolean) => void;
  private setIsTypingComplete: (value: boolean) => void; // NEW
  private usingModelTTS: boolean;
  private audio: string | null;
  private setIsoLoader: (value: boolean) => void;

  private isFirefox(): boolean {
    return navigator.userAgent.toLowerCase().includes("firefox");
  }

  constructor(
    setIsTimerPaused: (value: boolean) => void,
    setAudio: (value: string | null) => void,
    setIsSpeaking: (value: boolean) => void,
    setIsTypingComplete: (value: boolean) => void, // NEW
    usingModelTTS: boolean,
    audio: string | null,
    setIsoLoader: (value: boolean) => void
  ) {
    this.setIsTimerPaused = setIsTimerPaused;
    this.setAudio = setAudio;
    this.setIsSpeaking = setIsSpeaking;
    this.setIsTypingComplete = setIsTypingComplete; // NEW
    this.usingModelTTS = usingModelTTS;
    this.audio = audio;
    this.setIsoLoader = setIsoLoader;
  }

  async generateAudio(question: string) {
    this.setIsTimerPaused(true);

    if (
      !this.usingModelTTS &&
      "speechSynthesis" in window &&
      !this.isFirefox()
    ) {
      try {
        console.log("Yeah i got called");
        const utterance = new SpeechSynthesisUtterance(question);

        utterance.rate = 1.2;

        utterance.onstart = () => {
          this.setIsSpeaking(true);
          this.setIsTypingComplete(false); // Start typing when speech starts
        };

        utterance.onend = () => {
          this.setIsTimerPaused(false);
          this.setIsSpeaking(false);
          this.setIsoLoader(false);
        };
        utterance.onerror = () => {
          this.setIsTimerPaused(false);
          this.setIsSpeaking(false);
        };
        this.setIsTypingComplete(false); // Reset typing when speaking starts
        speechSynthesis.speak(utterance);
        return;
      } catch (error) {
        console.error("Error using built-in TTS:", error);
      }
    }

    // Fallback to model-based TTS
    try {
      console.log("Model TTS");

      // Start with skeleton showing
      this.setIsTypingComplete(true);

      // Generate audio
      const wav = await tts.predict({
        text: question,
        voiceId: "en_US-hfc_male-medium",
      });

      const audioUrl = URL.createObjectURL(wav);
      console.log("Audio generated successfully");

      this.setAudio(audioUrl);

      // Create audio element
      const audio = new Audio(audioUrl);

      // Add event listeners
      audio.addEventListener("playing", () => {
        console.log("Audio started playing");
        this.setIsSpeaking(true);
        this.setIsTypingComplete(false); // Start typing when audio starts
      });

      audio.addEventListener("ended", () => {
        console.log("Audio finished playing");
        this.setIsSpeaking(false);
        this.setIsoLoader(false);
      });

      // Actually play the audio
      audio.play().catch((error) => {
        console.error("Failed to play audio:", error);
        this.setIsSpeaking(false);
        this.setIsTypingComplete(true);
      });
    } catch (error) {
      console.error(`Error generating audio for question:`, error);
      this.setIsSpeaking(false);
      this.setIsTypingComplete(true);
    } finally {
      this.setIsTimerPaused(false);
    }
  }

  playAudio({ question }: { question: string }) {
    console.log("You summoned PlayAudio");
    console.log("usingModelTTS:", this.usingModelTTS);
    console.log("audio:", this.audio);
    if (this.usingModelTTS && this.audio) {
      console.log("Replay by Model");
      const audio = new Audio(this.audio);

      audio.onplay = () => {
        this.setIsSpeaking(true);
      };

      audio.onended = () => {
        this.setIsSpeaking(false);
      };

      audio.onerror = () => {
        console.error("Error playing model-based audio");
        this.setIsSpeaking(false);
      };

      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
        this.setIsSpeaking(false);
      });

      return;
    }

    // If using browser TTS
    if (
      !this.usingModelTTS &&
      "speechSynthesis" in window &&
      !this.isFirefox()
    ) {
      console.log("Replay by Browser TTS");
      try {
        const utterance = new SpeechSynthesisUtterance(question);

        utterance.rate = 1.2;

        utterance.onstart = () => {
          this.setIsSpeaking(true);
        };

        utterance.onend = () => {
          this.setIsSpeaking(false);
        };

        utterance.onerror = () => {
          console.error("Speech synthesis error");
          this.setIsSpeaking(false);
        };

        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Error using built-in TTS:", error);
        this.setIsSpeaking(false);
      }
    }
  }
}

export default AppService;
