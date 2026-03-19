import { gerarResposta } from "../Gemini/aiService.js";

async function generate() {
  const resposta = await gerarResposta(
    "Crie um post moderno sobre tecnologia e inteligência artificial"
  );

  try {
    const clean = resposta.replace(/```json|```/g, "");
    const json = JSON.parse(clean);

    console.log(json);
  } catch (err) {
    console.error("Erro ao converter JSON:", resposta);
  }
}

generate();