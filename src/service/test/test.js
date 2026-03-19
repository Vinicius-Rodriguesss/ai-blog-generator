import { gerarResposta } from "./ia.js";

async function testar() {
  const resposta = await gerarResposta(
    "Crie um post moderno sobre tecnologia e inteligência artificial"
  );

  console.log(resposta);
}

testar();