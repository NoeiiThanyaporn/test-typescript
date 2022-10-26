"use strict";
var myName = "Noeii Thanyaporn";
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
var WorkStatus;
(function (WorkStatus) {
    WorkStatus[WorkStatus["Task"] = 1] = "Task";
    WorkStatus[WorkStatus["Working"] = 2] = "Working";
    WorkStatus[WorkStatus["Done"] = 3] = "Done";
})(WorkStatus || (WorkStatus = {}));
let employee = [
    [1, "Noeii t.", true],
    [2, "Max t.", false],
];
console.log(employee);
console.log(employee[0]);
employee.push([3, "toong-Pang", true]);
console.log(employee);
console.log(WorkStatus.Task);
console.log(WorkStatus.Done);
//# sourceMappingURL=typeTest.js.map