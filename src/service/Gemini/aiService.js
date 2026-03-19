import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

// Inicializa a IA com a chave de API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function gerarResposta(promptUser) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API Key não encontrada no arquivo .env");
    }

    // Usamos o gemini-2.5-flash que confirmamos estar disponível
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      // Configuração crucial para JSON puro
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.8 // Aumentado levemente para textos mais fluídos e criativos
      }
    });

    // Pegamos a data atual dinamicamente
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    const prompt = `
      Atue como um redator técnico sênior de FrontEnd para um blog de tecnologia moderno.
      Sua tarefa é criar um post completo sobre o tema: "${promptUser}".

      Responda ESTRITAMENTE com um objeto JSON válido, seguindo este formato:
      {
        "slug": "string-kebab-case",
        "title": "Título impactante",
        "data": "${dataAtual}",
        "artigo": "FrontEnd",
        "author": "Vinicius Rodrigues",
        "text": "Resumo curto (1 frase) para o card da home",
        "content": "HTML_STRING",
        "staks": ["tech1", "tech2"]
      }

      REGRAS PARA O CAMPO "content" (A STRING HTML):
      1. Use HTML semântico. NÃO inclua tags <html>, <head> ou <body>. Apenas o conteúdo interno.
      2. Comece com um parágrafo (<p>) introdutório forte sobre o conceito e importância do tema.
      3. Use subtítulos (<h2>) para organizar as seções. Ex: "## Implementação Técnica".
      4. Inclua pelo menos um exemplo prático de código dentro de tags <pre><code>...</code></pre>.
      5. Se aplicável, use uma lista não ordenada (<ul> com <li>) para boas práticas ou vantagens.
      6. O parágrafo final deve abordar o impacto do tema no mercado de FrontEnd em 2026.
      7. Use linguagem técnica, mas didática.
      8. Certifique-se de escapar aspas duplas dentro da string HTML para não quebrar o JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Erro detalhado do Gemini:", error.message);
    // Retorna um JSON de erro válido
    return JSON.stringify({ error: `Falha na geração: ${error.message}` });
  }
}