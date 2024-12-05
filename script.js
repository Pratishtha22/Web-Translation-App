// Button References
const startRecordingButton = document.getElementById('start-recording');
const stopRecordingButton = document.getElementById('stop-recording');
const translateButton = document.getElementById('translate');
const playButton = document.getElementById('play-translation');
const transcriptDisplay = document.getElementById('transcript'); // Display for speech-to-text
const translationDisplay = document.getElementById('translation'); // Display for translation

// API Key for Google Cloud Translation API
const apiKey = 'AIzaSyDVKSGvcg3qXIXQODAf4noXjlxdQVG-xGM';

// Add Event Listeners
startRecordingButton.addEventListener('click', () => {
  console.log('Start recording clicked');
  recognition.start(); // Start the speech recognition
});

stopRecordingButton.addEventListener('click', () => {
  console.log('Stop recording clicked');
  recognition.stop(); // Stop the speech recognition
});

translateButton.addEventListener('click', () => {
  console.log('Translate clicked');
  // Translate the text using Google Cloud Translation API
  const textToTranslate = transcriptDisplay.textContent;
  const targetLanguage = document.getElementById('language-select').value; // Assume dropdown for language selection
  translateText(textToTranslate, targetLanguage);
});

playButton.addEventListener('click', () => {
  console.log('Play translation clicked');
  // Play the translated text (use SpeechSynthesis API for audio playback)
  playAudio(translationDisplay.textContent);
});

// Web Speech API for Speech Recognition (Speech-to-Text)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US'; // Set the language to English (US)

  recognition.onstart = () => {
    console.log('Speech recognition started');
    transcriptDisplay.textContent = "Listening..."; // Show listening status
  };

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join('');
    transcriptDisplay.textContent = transcript; // Display the recognized text
    console.log('Recognized Text:', transcript);
  };

  recognition.onerror = (event) => {
    transcriptDisplay.textContent = 'Error: ${event.error}';
    console.log('Error:', event.error);
  };

  recognition.onend = () => {
    console.log('Speech recognition ended');
    if (transcriptDisplay.textContent === "Listening...") {
      transcriptDisplay.textContent = ""; // Clear "Listening..." if no input
    }
  };
} else {
  alert('Speech Recognition API is not supported in your browser. Use Chrome or Edge.');
}

// Translate Function
async function translateText(text, targetLanguage) {
  if (!text) {
    alert("No text to translate!");
    return;
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
        }),
      }
    );

    const data = await response.json();
    if (data.data && data.data.translations) {
      const translatedText = data.data.translations[0].translatedText;
      translationDisplay.textContent = translatedText; // Show translated text
      console.log('Translated Text:', translatedText);
    } else {
      throw new Error('Translation failed');
    }
  } catch (error) {
    console.error('Translation Error:', error);
    translationDisplay.textContent = 'Translation failed. Please try again.';
  }
}

// Play Audio Function using SpeechSynthesis API
function playAudio(text) {
  if (!text) {
    alert("No text to play!");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance); // Speak the translated text
}