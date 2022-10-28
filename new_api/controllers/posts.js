"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPost = exports.deletePost = exports.updatePost = exports.getPost = exports.getPosts = exports.extractRecord = exports.stringField = exports.requiredField = exports.noParseParser = void 0;
const axios_1 = __importDefault(require("axios"));
function noParseParser({ value }) {
    return value;
}
exports.noParseParser = noParseParser;
// ไว้สำหรับ required field <บังคับใส่>
function requiredField(fn = noParseParser) {
    return ({ key, value }) => {
        console.log("--1--");
        if (value === undefined || value === null)
            throw {
                error: {
                    statusCode: 422,
                    message: `Missing required field. "${key}" field is required.`
                }
            };
        return fn({ key, value });
    };
}
exports.requiredField = requiredField;
// check value ว่าเป็น string ไหม
function stringField({ value }) {
    console.log("--2--");
    if (value !== undefined && typeof value !== "string") {
        console.log("--2.1--");
        try {
            throw {
                statusCode: 422,
                message: `Expected string but found ${typeof value}`
            };
        }
        catch (e) {
            console.log('Error:', e);
        }
    }
    console.log("--2.2--");
    return value;
}
exports.stringField = stringField;
function extractRecord(obj, specs) {
    let result = {};
    for (let key of Object.keys(specs)) {
        const fn = specs[key];
        if (fn !== undefined)
            result[key] = fn({ key, value: obj[key] });
    }
    return result;
}
exports.extractRecord = extractRecord;
// getting all posts
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get some posts
    let result = yield axios_1.default.get(`https://jsonplaceholder.typicode.com/posts`);
    let posts = result.data;
    return res.status(200).json({
        message: posts
    });
});
exports.getPosts = getPosts;
// getting a single post
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the post id from the req
    let id = req.query.id;
    // get the post
    let result = yield axios_1.default.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    let post = result.data;
    return res.status(200).json({
        message: post
    });
});
exports.getPost = getPost;
// updating a post
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // async () => {
    let { id, title, body } = extractRecord(req.body, {
        // id: req.body.id,
        // title: req.body.title ?? null,
        // body: req.body.body ?? null, 
        id: requiredField(stringField),
        title: requiredField(stringField),
        body: requiredField(stringField),
    });
    // update the post
    let response = yield axios_1.default.put(`https://jsonplaceholder.typicode.com/posts/${id}`, Object.assign(Object.assign({}, (title && { title })), (body && { body })));
    // return response
    return res.status(200).json({
        message: response.data
    });
    // }
});
exports.updatePost = updatePost;
// deleting a post
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the post id from req.params
    let id = req.params.id;
    // delete the post
    let response = yield axios_1.default.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    // return response
    return res.status(200).json({
        message: 'post deleted successfully'
    });
});
exports.deletePost = deletePost;
// adding a post
const addPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the data from req.body
    let title = req.body.title;
    let body = req.body.body;
    // add the post
    let response = yield axios_1.default.post(`https://jsonplaceholder.typicode.com/posts`, {
        title,
        body
    });
    // return response
    return res.status(200).json({
        message: response.data
    });
});
exports.addPost = addPost;
