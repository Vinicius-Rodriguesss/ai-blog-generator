import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function gerarResposta(prompt) {
  try {
    // Verificação básica da chave
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API Key não encontrada no arquivo .env");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    // Simplificando a chamada se for apenas texto simples
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    // Log detalhado para te ajudar a debugar
    console.error("Erro detalhado do Gemini:", error.message);
    return `Erro ao gerar resposta: ${error.message}`;
  }
}