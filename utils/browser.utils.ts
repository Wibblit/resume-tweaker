const checkBrowserTTS = () => {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve(false);
      return;
    }

    // Detect Mozilla Firefox
    const isFirefox = /firefox/i.test(navigator.userAgent);
    if (isFirefox) {
      resolve(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance("Test speech");
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 500);
  });
};

export { checkBrowserTTS };
