/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
// import { arrayParserBuilder, dateField, extractRecord, fromEnvOrThrow, intoExpressHandler, intField, requiredField, resultWrapper, standardSecurityHeader, stringField } from "../utils"
import { extractRecord, intoExpressHandler, requiredField, stringField, intField } from "../utils"

interface Post {
    userId: Number;
    id: Number;
    title: String;
    body: String;
}

// getting all posts
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
    let posts: [Post] = result.data;
    return res.status(200).json({
        message: posts
    });
};

// getting a single post
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    let id = req.query.id;
    // get the post
    let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    let post: Post = result.data;
    
    return res.status(200).json({
        message: post
    });
};


// updating a post
export const updatePost = intoExpressHandler(
   async (req) => {
        req: Request
    let {id, title, body} = extractRecord(req.body, {
        id: requiredField(intField),    
        title: requiredField(stringField), 
        body: requiredField(stringField),
    })

        // update the post
        let response: AxiosResponse = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            ...(title && { title }),
            ...(body && { body })
        });

        // return response
        return res.status(200).json({
        message: response.data
    });
// }
})

// deleting a post
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from req.params
    let id: string = req.params.id;
    // delete the post
    let response: AxiosResponse = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    // return response
    return res.status(200).json({
        message: 'post deleted successfully'
    });
};

// adding a post
export const addPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the data from req.body
    let title: string = req.body.title;
    let body: string = req.body.body;
    // add the post
    let response: AxiosResponse = await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
        title,
        body
    });
    // return response
    return res.status(200).json({
        message: response.data
    });
};

