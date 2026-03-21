import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

// Inicializa a IA com a chave de API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function gerarResposta() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API Key não encontrada no arquivo .env");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",

      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });


    const dataAtual = new Date().toLocaleDateString('pt-BR');

    const prompt = `
    Atue como um Engenheiro de Software Sênior e Redator Técnico especializado em um blog de tecnologia moderno.

    Sua expertise deve ser abrangente e holística, cobrindo todo o ciclo de vida do desenvolvimento de software, incluindo:
    Front-end, Back-end, Infraestrutura, Banco de Dados e Metodologias Ágeis (como Scrum).

    A cada nova requisição, gere um post com um tema diferente dentro dessas áreas (por exemplo: front-end, back-end, infraestrutura, Scrum ou banco de dados), garantindo variedade e profundidade nos conteúdos produzidos.

      Responda ESTRITAMENTE com um objeto JSON válido, seguindo este formato:
      {
        "slug": "string-kebab-case",
        "title": "Título impactante e técnico",
        "data": "${dataAtual}",
        "artigo": "Categoria específica do post (ex: Back-end, IA, Infra, Fullstack)",
        "author": "Vinicius Rodrigues",
        "text": "Resumo curto (1 frase) focado no valor de negócio ou técnico",
        "content": "HTML_STRING",
        "staks": ["tech1", "tech2", "metodologia"]
      }

      REGRAS PARA O CAMPO "content" (A STRING HTML):
      1. Use HTML semântico. NÃO inclua tags <html>, <head> ou <body>. Apenas o conteúdo interno.
      2. Comece com um parágrafo (<p>) introdutório que conecte o tema à visão sistêmica da engenharia de software.
      3. Use subtítulos (<h2>) para organizar as seções. Ex: "Arquitetura e Implementação".
      4. Inclua pelo menos um exemplo prático de código (Front, Back ou Infra) dentro de tags <pre><code>...</code></pre>.
      5. Use uma lista não ordenada (<ul> com <li>) para destacar boas práticas, vantagens ou ritos ágeis.
      6. O parágrafo final deve abordar o impacto do tema na Engenharia de Software global em 2026.
      7. Use linguagem técnica avançada, mas didática.
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