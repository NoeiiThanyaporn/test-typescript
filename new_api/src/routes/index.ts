/** source/routes/posts.ts */
import express from 'express';
import { getPosts, getPost, addPost, updatePost, deletePost } from '../app';
const router = express.Router();

router.get('/getAll', getPosts);
router.get('/getOne', getPost);
router.put('/update', updatePost);
router.delete('/delete', deletePost);
router.post('/create', addPost);

export = router;