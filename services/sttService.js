// services/sttService.js
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const fs = require('fs');

const sttService = {
  async convertSpeechToText(audioFilePath) {
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION);
    const audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(audioFilePath));
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    return new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(result => {
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          resolve({ text: result.text });
        } else {
          reject(new Error("Failed to recognize speech"));
        }
      });
    });
  }
};

module.exports = sttService;
