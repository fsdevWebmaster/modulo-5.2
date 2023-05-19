import express from 'express';
import { createPost, listPosts, postDetail, updatePost, deletePost 
  } from '../controllers/app.controller.js';
const router = express.Router();

router.post('/posts', createPost);
router.get('/posts', listPosts);
router.get('/posts/:id', postDetail);
router.patch('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

export default router;