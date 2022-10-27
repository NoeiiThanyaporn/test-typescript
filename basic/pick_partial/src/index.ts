// เป็นคุณสมบัติหลัก ว่าถ้าเป็นสัตว์จะต้องมีอะไรบ้าง
interface Animal {
  legs: number;
  wings: number;
  canWalk: boolean;
  canFly: boolean;
  canSwim: boolean;
  canSpeak: boolean;
}

// เป็น function สำหรับ check ว่าเป็นนกหรือเปล่า โดยจะมีคุณสมบัติว่า 2 ขา, 2 ปีก, เดินได้, บินได้
function isBird(obj: Animal) {
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
}

const myBird2 = {
  legs: 2,
  wings: 2,
  canWalk: true,
  canFly: true,
}

// ไม่มีคุณสมบัติ canFly
const myBird3 = {
  legs: 2,
  wings: 2,
  canWalk: true,
}

// ไม่มีคุณสมบัติ canFly
const myBird4 = {
  legs: 2,
  wings: 2,
  canWalk: true,
  canSpeak: false
}

// มี เขากับหางเพิ่มเข้ามา --> จริงน้องเป็น pegasus
const pegasus = {
  legs: 2,
  wings: 2,
  tail: 1,
  canWalk: true,
  canFly: true,
  canSpeak: true
}

// เป็นหมาโบ้
const myDog = {
  legs: 4,
  wings: 2,
  canWalk: true,
  canFly: false,
  canSwim: false,
  canSpeak: false
}


console.log("First fn:", isBird(myBird))

/**
 * จากด้าน code ด้านบนสามารถเขียนได้โดยใช้วิธี 'Pick and Partial'
 * Pick ----> เลือกเฉพาะ field ที่ต้องการ (เลือกแค่บาง field ไม่เลือกทั้งหมด)
 * Partial ----> ทำให้ field ที่ไม่ได้ถูกเลือกจาก pick เป็น optional
 */

// Animal นี้มาจาก interface Animal ข้างบน เลือกเฉพาะคุณสมบัติที่จะเป็นนก 
type BirdSpec = Pick<Animal, 'legs' | 'wings' | 'canWalk' | 'canFly'>;
function isBird2(obj: BirdSpec) {
  return obj.legs === 2 && obj.wings === 2 && obj.canWalk && obj.canFly;
}

console.log("Second fn & b1:", isBird2(myBird))
console.log("Second fn & b2:", isBird2(myBird2))
console.log("Second fn & Pegasus:", isBird2(pegasus))


// // ขอมีคุณสมบัติที่เลือกทั้งหมดใน pick ก็จะไม่ติด err compile
// console.log("Second fn & b2:", isBird2(myBird3))
// console.log("Second fn & b2:", isBird2(myBird4))
// console.log("Second fn & b2:", isBird2(myDog))



/**
 * จากข้างบนก็จะเหมือนการเขียน interface แบบนี้
interface BirdSpec {
    legs: number;
    wings: number;
    canWalk: boolean;
    canFly: boolean;
}
 */

/**
 * ข้อดี Pick: เมื่อมีการเปลี่ยนแปลง type ใน interface มันก็จะแก้ไขที่ interface แค่ที่เดียว
 * ข้อเสีย Pick: ไม่สามารถเพิ่ม field ตัวอื่นได้ เลือกไว้แค่ไหน ก็จะใช้แค่นั้น --> หมายถึง จะไม่สามารถเอา field อื่น ๆ ใน animal มาใช้ใน function ได้ ใช้ได้แค่ ที่เลือกไว้เท่านั้น
 * สามารแก้ไขข้อเสียของ Pick คือ Partial
 * Partial จะทำให้ทุก ๆ field เป็น optional --> หมายความว่า function จะยังสามารถเรียกใช้ filed อื่น ๆ ใน animal ได้ ไม่ใช่แค่ใน birdSpec อย่างเดียว
 */

/**
type MaybeAnimal = Partial<Animal>;
interface MaybeAnimal {
  legs?: number;
  wings?: number;
  canWalk?: boolean;
  canFly?: boolean;
  canSwim?: boolean;
  canSpeak?: boolean;
}
 */

// รวม pick และ partial เข้ามาใช้ด้วยกัน  
type BirdSpec2 = Pick<Animal, 'legs' | 'wings' | 'canWalk' | 'canFly'> & Partial<Animal>;
function whatIsAnimal(obj: BirdSpec2) {
  if (obj.legs === 2 && obj.wings === 2 && obj.canWalk && obj.canFly && !obj.canSpeak){
    return "bird"
  } else if (obj.legs === 2 && obj.canSwim && obj.canWalk && !obj.canFly && obj.canSpeak) {
    return "humen"
  } else if (obj.legs === 4 && !obj.canSwim && obj.canWalk && !obj.canFly) {
    return "dog & cat"
  } else if (!obj.canWalk && !obj.canFly && obj.canSwim ) {
    return "fish"
  } else {
    return "no animal"
  }
}

console.log("Third fn & b1:", whatIsAnimal(myBird))
console.log("Third fn & b2:", whatIsAnimal(myBird2))
console.log("Third fn & Pegasus:", whatIsAnimal(pegasus))
console.log("Third fn & dog:", whatIsAnimal(myDog))



// // ขอมีคุณสมบัติที่เลือกทั้งหมดใน pick ก็จะไม่ติด err compile
// console.log("Third fn & b2:", isBird3(myBird3)) 
// console.log("Third fn & b2:", isBird3(myBird4))

/**
interface BirdSpec2 {
  legs: number;
  wings: number;
  canWalk: boolean;
  canFly: boolean;
  canSwim?: boolean;
  canSpeak?: boolean;
}
 */

/**
 * สร้าง Generic Type ขึ้นมาใหม่
 * ซึ่งรูปแบบจะเหมือน type BirdSpec2 เมื่อนำไปเรียกใช้ 
 * T == interface Animal
 * K extends keyof T == myBird2 ที่ทำการ extends Animal มา 
 * extends คือการถ่ายทอดคุณสมบัติของ interface หลักมาที่ intterface ย่อย (แม่สู่ลูก โดยที่คุณสมบัตินั้น ๆ อาจจะไม่มาที่ลูกทั้งหมด)
 * Pick<T, K> & Partial<T> == 
 * - Pick<T, K> เลือกคุณสมบัติจากแม่ที่ต้องการนำมาใช้เป็นหลักในลูก
 * - Partial<T> คุณสมบัติอื่น ๆ ของแม่ที่ไม่ได้เลือกให้เป็น optional 
 */
export type RequiredSome<T, K extends keyof T> = Pick<T, K> & Partial<T>;
type BirdSpec3 = RequiredSome<Animal, 'legs' | 'wings' | 'canWalk' | 'canFly'>;
function isBird4(obj: BirdSpec3) {
  return obj.legs === 2 && obj.wings === 2 && obj.canWalk && obj.canFly;
}

console.log("Fourth fn & b1:", isBird4(myBird))
console.log("Fourth fn & b2:", isBird4(myBird2))

// // ขอมีคุณสมบัติที่เลือกทั้งหมดใน pick ก็จะไม่ติด err compile
// console.log("Third fn & b2:", isBird4(myBird3)) 
// console.log("Third fn & b2:", isBird4(myBird4))