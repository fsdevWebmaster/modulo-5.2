import express from 'express';
import { createPost, listPosts, postDetail, updatePost, deletePost ,
  createUser, login, activateUser
} from '../controllers/app.controller.js';
import { postsAuth } from '../middlewares/app.middleware.js';
const router = express.Router();

// user
router.post('/users', createUser)
router.post('/login', login)

// post
router.post('/posts', postsAuth, createPost);
router.get('/posts', postsAuth, listPosts);
router.get('/posts/:id', postsAuth, postDetail);
router.patch('/posts/:id', postsAuth, updatePost);
router.delete('/posts/:id', postsAuth, deletePost);

// activate
router.get('/activate/:key', activateUser);


export default router;