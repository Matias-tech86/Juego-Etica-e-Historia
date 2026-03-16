import { GoogleGenAI } from "@google/genai";

async function generateImages() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompts = [
    "A majestic ancient Roman temple dedicated to Asclepius, with marble columns, statues of snakes, and a serene atmosphere of healing. Cinematic lighting, high detail.",
    "An ancient Roman military hospital (valetudinarium) inside a legionary fort, with rows of wooden beds, medical tools, and soldiers being treated. Historical accuracy, cinematic.",
    "A wide view of the Roman Forum, focusing on the engineering of the Cloaca Maxima and public fountains, showing the grandeur of Roman sanitation. Sunny day, detailed architecture.",
    "The training grounds of the gladiators in Rome (Ludus Magnus), with the Colosseum in the background, showing a medical area where wounded fighters are being examined. Gritty, realistic.",
    "A luxurious interior of the Roman Imperial Palace, with mosaics and frescoes, where a physician is consulting with a high-ranking official or the Emperor. Opulent, detailed."
  ];

  const results = [];

  for (const prompt of prompts) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        results.push(`data:image/png;base64,${part.inlineData.data}`);
      }
    }
  }
  
  return results;
}
