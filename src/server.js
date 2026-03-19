import express from 'express';
import connectDB from './config/connection.js';
import { gerarResposta } from "./service/Gemini/aiService.js";
import PromptResult from './models/PromptResult.js';
import 'dotenv/config';


async function generateAndSave() {
  const resposta = await gerarResposta(
    "Crie um post moderno sobre tecnologia e inteligência artificial"
  );

  try {
    // 🔍 Validação: Verifica se a resposta contém o padrão de erro de quota
    if (typeof resposta === 'string' && resposta.includes('"error"') && resposta.includes('429')) {
      console.error("⚠️ Falha na API: Limite de requisições excedido. Não salvando no banco.");
      return; // Interrompe a função aqui
    }

    // Validação extra: se por acaso a resposta vier vazia ou nula
    if (!resposta) {
      console.error("⚠️ Resposta vazia recebida da IA.");
      return;
    }

    // 💾 Salva apenas se passar nas validações acima
    await PromptResult.create({
      prompt: "Post semanal IA",
      resposta: resposta, 
    });

    console.log(`✅ Post salvo com sucesso no banco!`);

  } catch (err) {
    console.error("❌ ERRO ao processar/salvar:", err.message);
  }
}

// ⏰ semanal
function startWeeklyJob() {
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

  generateAndSave();

  setInterval(() => {
    console.log("⏳ Gerando post semanal...");
    generateAndSave();
  }, ONE_WEEK);
}

const app = express();
app.use(express.json());

connectDB();
startWeeklyJob();

app.get('/posts', async (req, res) => {
  try {
    const posts = await PromptResult.find().sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar posts",
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});