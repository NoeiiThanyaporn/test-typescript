"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/** source/routes/posts.ts */
const express_1 = __importDefault(require("express"));
const posts_1 = require("../controllers/posts");
const router = express_1.default.Router();
router.get('/getAll', posts_1.getPosts);
router.get('/getOne', posts_1.getPost);
router.put('/update', posts_1.updatePost);
router.delete('/delete', posts_1.deletePost);
router.post('/create', posts_1.addPost);
module.exports = router;
