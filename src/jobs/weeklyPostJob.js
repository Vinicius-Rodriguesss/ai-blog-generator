import PromptResult from '../models/PromptResult.js';
import { gerarResposta } from '../services/gemini/aiService.js';
import { isInvalidResponse } from '../utils/responseValidator.js';

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const generateAndSave = async () => {
  const resposta = await gerarResposta();

  try {
    if (isInvalidResponse(resposta)) {
      console.error('⚠️ Falha na API: Limite de requisições excedido ou resposta inválida. Não salvando no banco.');
      return;
    }

    await PromptResult.create({
      prompt: 'Post semanal IA',
      resposta,
    });

    console.log('✅ Post salvo com sucesso no banco!');
  } catch (error) {
    console.error('❌ ERRO ao processar/salvar:', error.message);
  }
};

export const startWeeklyJob = () => {
  generateAndSave();

  setInterval(() => {
    console.log('⏳ Gerando post semanal...');
    generateAndSave();
  }, ONE_WEEK_IN_MS);
};
