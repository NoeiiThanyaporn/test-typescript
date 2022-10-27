var myName: string = "Noeii Thanyaporn";
// console.log(myName, " : ", typeof myName);

// var money: number = 100;
// console.log(money, " : ", typeof money);

// const myArray: number[] = [1, 2, 3];
// console.log(myArray);

// let myArray2: any[] = [1, 2, 3, "Hello"];
// console.log(myArray2);
// // console.log(myArray2[0]);
// console.log(myArray2.pop());
// console.log(myArray2.pop());
// console.log(myArray2.pop());
// console.log(myArray2.push("Noeii"));
// console.log(myArray2);

enum WorkStatus {
  Task = 1, // dafault === 0
  Working,
  Done,
}

let employee: [number, string, boolean][] = [
  [1, "Noeii t.", true],
  [2, "Max t.", false],
];
console.log(employee);
console.log(employee[0]);
employee.push([3, "toong-Pang", true]);
console.log(employee);

console.log(WorkStatus.Task);
console.log(WorkStatus.Done);

