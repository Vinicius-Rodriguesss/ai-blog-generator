import express from 'express';
import cors from 'cors'; // 👈 IMPORTANTE
import connectDB from './config/connection.js';
import { gerarResposta } from "./service/Gemini/aiService.js";
import PromptResult from './models/PromptResult.js';
import 'dotenv/config';

async function generateAndSave() {
  const resposta = await gerarResposta(
    "Crie um post moderno sobre tecnologia e inteligência artificial"
  );

  try {
    // 🔍 Validação: erro de quota
    if (typeof resposta === 'string' && resposta.includes('"error"') && resposta.includes('429')) {
      console.error("⚠️ Falha na API: Limite de requisições excedido. Não salvando no banco.");
      return;
    }

    // 🔍 validação extra
    if (!resposta) {
      console.error("⚠️ Resposta vazia recebida da IA.");
      return;
    }

    // 💾 salvar
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

// ✅ CORS AQUI (ANTES DAS ROTAS)
app.use(cors());

// (opcional - mais seguro)
// app.use(cors({
//   origin: ['http://localhost:5173', 'https://seusite.com'],
// }));

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