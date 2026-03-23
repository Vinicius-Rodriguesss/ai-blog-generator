import { Router } from 'express';
import { listPosts } from '../controllers/postController.js';

const postRoutes = Router();

postRoutes.get('/posts', listPosts);

export default postRoutes;
