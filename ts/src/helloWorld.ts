import { Humen } from "./objectOrentes";

// let message: string = "Hello World in Message";
// let number: number = 1;

// console.log("Hello World");
// console.log(message);
// console.log(number);

const user1: any = new Humen();
user1.name = "Thanyaporn";
user1.lastname = "Thanapornpibanchonn";
user1.age = 24.2;
console.log(user1.sayHello());
