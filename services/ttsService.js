// services/ttsService.js
const sdk = require('microsoft-cognitiveservices-speech-sdk');

const ttsService = {
  async convertTextToSpeech(text) {
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION);
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput("output.wav");
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    return new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        result => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            resolve({ audio: "output.wav" });
          } else {
            reject(new Error("Failed to synthesize speech"));
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
};

module.exports = ttsService;
