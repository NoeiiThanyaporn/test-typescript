"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/** source/routes/posts.ts */
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.get('/getAll', controllers_1.getPosts);
router.get('/getOne', controllers_1.getPost);
router.put('/update', controllers_1.updatePost);
router.delete('/delete', controllers_1.deletePost);
router.post('/create', controllers_1.addPost);
module.exports = router;
