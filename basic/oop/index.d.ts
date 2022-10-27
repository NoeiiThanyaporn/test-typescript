/**
 * ตัวแปรที่อยู่ใน class จะต้อง assign ค่า default ไว้ เช่น
 * สำหรับทุก type = undefined,
 * สำหรับ number = 0,
 * สำหรับ string = ''
 */
/**
 * การกำหนดตัว constructor ไว้ใน class เป็นการบังคับว่าจะต้อง assign ค่า default ให้กับตัวแปรใน class
 **/
/**
 * ถ้าใน constructor มีการกำหนดค่าไว้ให้อยู่แล้ว เวลาเรียกใช้ก็ไม่จำเป็นต้อง assign ค่าให้ก็ได้
 * readonly จะไม่สามารถแก้ไขได้ จะอ่านได้อย่าเดียว
*/
/**
 * Overload by class
 */
/**
 * Overload by function
 */
/**
 * Setter Getter
 */
declare class Point {
    _x: number;
    get x(): number;
    set x(value: number);
}
declare const p: Point;
/**
 * Extends
 */
declare class Person {
    name: string;
    constructor(name: string);
    sayHi(): void;
}
declare class Employee extends Person {
    salary: number;
    constructor(name: string, salary: number);
    sayHi(): void;
}
declare const person: Employee;
/**
 * Abstract
 * จะไม่สามารถเอามาเป็น class ได้เลย ด้วยตัวมันเอง
 * ไม่มีรูปแบบวิธีการทำงาน
 */
declare abstract class Charactor {
    name: string | undefined;
    damage: number;
    attackSeed: number;
    constructor(name: string, damage: number, speed: number);
    abstract damagePerSecond(): number;
}
declare class Goblin extends Charactor {
    constructor(name: string, damage: number, speed: number);
    damagePerSecond(): number;
}
