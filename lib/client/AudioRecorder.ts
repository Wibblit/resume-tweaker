export class AudioRecorder {
    private mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
    private setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
    private audioChunks: Blob[];  // Keeps all audio chunks, even during pause
    private isRecordingPaused: boolean;
    private previousBlob: Blob | null;
  
    constructor(
      mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>,
      setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>
    ) {
      this.mediaRecorderRef = mediaRecorderRef;
      this.setAudioBlob = setAudioBlob;
      this.audioChunks = [];
      this.isRecordingPaused = false;
      this.previousBlob = null;
      this.setupEventHandlers();
    }
  
    private setupEventHandlers(): void {
      if (this.mediaRecorderRef.current) {
        this.mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) {
            // Add all audio chunks regardless of pause/resume state
            this.audioChunks.push(event.data);
            this.updateAudioBlob();
          }
        };
  
        this.mediaRecorderRef.current.onstop = () => {
          this.updateAudioBlob();
        };
      }
    }
  
    private async updateAudioBlob(): Promise<void> {
      // Combine the audioChunks into a new Blob to reflect the updated audio
      const newBlob = new Blob(this.audioChunks, { type: "audio/webm" });
      this.setAudioBlob(newBlob);
    }
  
    startRecording(): void {
      if (
        this.mediaRecorderRef.current &&
        this.mediaRecorderRef.current.state !== "recording"
      ) {
        // Clear any previous chunks and start fresh for the new recording
        this.audioChunks = [];
        this.previousBlob = null;
        this.mediaRecorderRef.current.start(100); // Start recording with a time slice of 100ms
      }
    }
  
    stopRecording(): void {
      if (
        this.mediaRecorderRef.current &&
        this.mediaRecorderRef.current.state === "recording"
      ) {
        this.mediaRecorderRef.current.stop();
        this.previousBlob = null;
      }
    }
  
    pauseRecording(): void {
      if (
        this.mediaRecorderRef.current &&
        this.mediaRecorderRef.current.state === "recording"
      ) {
        this.isRecordingPaused = true;
        this.mediaRecorderRef.current.pause();
        // No need to clear the audio chunks, just continue adding them during the paused state
      }
    }
  
    resumeRecording(): void {
      if (
        this.mediaRecorderRef.current &&
        this.mediaRecorderRef.current.state === "paused"
      ) {
        this.isRecordingPaused = false;
        this.mediaRecorderRef.current.resume();
        // No reset needed for audio chunks; we continue from where we left off
      }
    }
  
    toggleRecordingState(): void {
      if (this.mediaRecorderRef.current) {
        if (this.mediaRecorderRef.current.state === "recording") {
          this.pauseRecording();
        } else if (this.mediaRecorderRef.current.state === "paused") {
          this.resumeRecording();
        }
      }
    }
  
    clearAudio(): void {
      this.audioChunks = [];  // Clear the chunks if needed
      this.previousBlob = null;
      this.setAudioBlob(null);  // Reset the blob
    }
  
    isRecording(): boolean {
      return this.mediaRecorderRef.current?.state === "recording" || false;
    }
  
    isPaused(): boolean {
      return this.mediaRecorderRef.current?.state === "paused" || false;
    }
  
    isInitialized(): boolean {
      return this.mediaRecorderRef.current !== null;
    }
  }
  