"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// เป็น function สำหรับ check ว่าเป็นนกหรือเปล่า โดยจะมีคุณสมบัติว่า 2 ขา, 2 ปีก, เดินได้, บินได้
function isBird(obj) {
    return obj.legs === 2 && obj.wings === 2 && obj.canWalk && obj.canFly;
}
// เลือกใส่เฉพาะ field ที่ต้องการไม่ได้ เพราะ filed ใน interface ก็ไม่ได้ตั้งให้เป็น optional
// ทำให้ myBird อันนี้ไม่ใช่คุณสมบัติของนกที่ต้องการ 
const myBird = {
    legs: 2,
    wings: 2,
    canWalk: true,
    canFly: true,
    canSwim: false,
    canSpeak: false
};
const myBird2 = {
    legs: 2,
    wings: 2,
    canWalk: true,
    canFly: true,
};
console.log("First fn:", isBird(myBird));
function isBird2(obj) {
    return obj.legs === 2 && obj.wings === 2 && obj.canWalk && obj.canFly;
}
console.log("Second fn & b1:", isBird2(myBird));
console.log("Second fn & b2:", isBird2(myBird2));
function isBird3(obj) {
    return obj.legs === 2 && obj.wings === 2 && obj.canWalk && obj.canFly;
}
console.log("Third fn & b2:", isBird3(myBird2));
console.log("Third fn & b2:", isBird3(myBird2));
function isBird4(obj) {
    return obj.legs === 2 && obj.wings === 2 && obj.canWalk && obj.canFly;
}
console.log("Fourth fn & b2:", isBird3(myBird2));
console.log("Fourth fn & b2:", isBird3(myBird2));
//# sourceMappingURL=index.js.map