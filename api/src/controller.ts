// access the data store (store.json)
import fs from "fs";
import path from "path";

// handle requests and reponses
import { ServerResponse, IncomingMessage } from "http";

// access the task structure
import { Task } from "./task";

// getTasks func: For get data
export const getTasks = (req: IncomingMessage, res: ServerResponse) => {
    return fs.readFile(
      // ใส่ path storage ตรงนี้
     path.join(__dirname, "store.json"),
     "utf8",
     (err, data) => {
       // Read the store.json file
       // Check out any errors
       if (err) {
         // error, send an error message
         res.writeHead(500, { "Content-Type": "application/json" });
         res.end(
           JSON.stringify({
             success: false,
             error: err,
           })
         );
       } else {
         // no error, send the data
         res.writeHead(200, { "Content-Type": "application/json" });
         res.end(
           JSON.stringify({
             success: true,
             message: JSON.parse(data),
           })
         );
       }
     }
   );
}

// addTask func: For create data
export const addTask = (req: IncomingMessage, res: ServerResponse) => {
   // Read the data from the request
   let data = "";

   req.on("data", (chunk) => {
     data += chunk.toString();
   });

   // When the request is done
   req.on("end", () => {
     let task = JSON.parse(data);

     // Read the store.json file
     fs.readFile(path.join(__dirname, "store.json"), "utf8", (err, data) => {
       // Check out any errors
       if (err) {
         // error, send an error message
         res.writeHead(500, { "Content-Type": "application/json" });
         res.end(
           JSON.stringify({
             success: false,
             error: err,
           })
         );
       } else {
         // no error, get the current tasks
         let tasks: [Task] = JSON.parse(data);
         // get the id of the latest task
         let latest_id = tasks.reduce(
           (max = 0, task: Task) => (task.id > max ? task.id : max),
           0
         );
         // increment the id by 1
         task.id = latest_id + 1;
         // add the new task to the tasks array
         tasks.push(task);
         // write the new tasks array to the store.json file
         fs.writeFile(
           path.join(__dirname, "store.json"),
           JSON.stringify(tasks),
           (err) => {
             // Check out any errors
             if (err) {
               // error, send an error message
               res.writeHead(500, { "Content-Type": "application/json" });
               res.end(
                 JSON.stringify({
                   success: false,
                   error: err,
                 })
               );
             } else {
               // no error, send the data
               res.writeHead(200, { "Content-Type": "application/json" });
               res.end(
                 JSON.stringify({
                   success: true,
                   message: task,
                 })
               );
             }
           }
         );
       }
     });
   });
};

// updateTaks func: For update data
export const updateTask = (req: IncomingMessage, res: ServerResponse) => {
   // Read the data from the request
   let data = "";
   req.on("data", (chunk) => {
     data += chunk.toString();
   });
   // When the request is done
   req.on("end", () => {
     // Parse the data
     let task: Task = JSON.parse(data);
     // Read the store.json file
     fs.readFile(path.join(__dirname, "store.json"), "utf8", (err, data) => {
       // Check out any errors
       if (err) {
         // error, send an error message
         res.writeHead(500, { "Content-Type": "application/json" });
         res.end(
           JSON.stringify({
             success: false,
             error: err,
           })
         );
       } else {
         // no error, get the current tasks
         let tasks: [Task] = JSON.parse(data);
         // find the task with the id
         let index = tasks.findIndex((t) => t.id == task.id);
         // replace the task with the new one
         tasks[index] = task;
         // write the new tasks array to the store.json file
         fs.writeFile(
           path.join(__dirname, "store.json"),
           JSON.stringify(tasks),
           (err) => {
             // Check out any errors
             if (err) {
               // error, send an error message
               res.writeHead(500, { "Content-Type": "application/json" });
               res.end(
                 JSON.stringify({
                   success: false,
                   error: err,
                 })
               );
             } else {
               // no error, send the data
               res.writeHead(200, { "Content-Type": "application/json" });
               res.end(
                 JSON.stringify({
                   success: true,
                   message: task,
                 })
               );
             }
           }
         );
       }
     });
   });
};

// deleteTask func: For delete data
export const deleteTask = (req: IncomingMessage, res: ServerResponse) => {
   // Read the data from the request
   let data = "";
   req.on("data", (chunk) => {
     data += chunk.toString();
   });
   // When the request is done
   req.on("end", () => {
     // Parse the data
     let task: Task = JSON.parse(data);
     // Read the store.json file
     fs.readFile(path.join(__dirname, "store.json"), "utf8", (err, data) => {
       // Check out any errors
       if (err) {
         // error, send an error message
         res.writeHead(500, { "Content-Type": "application/json" });
         res.end(
           JSON.stringify({
             success: false,
             error: err,
           })
         );
       } else {
         // no error, get the current tasks
         let tasks: [Task] = JSON.parse(data);
         // find the task with the id
         let index = tasks.findIndex((t) => t.id == task.id);
         // remove the task
         tasks.splice(index, 1);
         // write the new tasks array to the store.json file
         fs.writeFile(
           path.join(__dirname, "store.json"),
           JSON.stringify(tasks),
           (err) => {
             // Check out any errors
             if (err) {
               // error, send an error message
               res.writeHead(500, { "Content-Type": "application/json" });
               res.end(
                 JSON.stringify({
                   success: false,
                   error: err,
                 })
               );
             } else {
               // no error, send the data
               res.writeHead(200, { "Content-Type": "application/json" });
               res.end(
                 JSON.stringify({
                   success: true,
                   message: task,
                 })
               );
             }
           }
         );
       }
     });
   });
};