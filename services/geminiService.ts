
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getVehicleAdvice = async (vehicleInfo: string, userQuestion: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um mecânico especialista chamado 'Doutor Carro'.
      Dados do Veículo: ${vehicleInfo}
      Pergunta do Usuário: ${userQuestion}
      Responda de forma curta, técnica porém amigável em português do Brasil.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, estou com problemas para analisar isso agora. Verifique o manual ou consulte seu mecânico de confiança.";
  }
};
