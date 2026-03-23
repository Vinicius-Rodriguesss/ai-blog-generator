import PromptResult from '../models/PromptResult.js';

export const listPosts = async (req, res) => {
  try {
    const posts = await PromptResult.find().sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar posts',
      error: error.message,
    });
  }
};
