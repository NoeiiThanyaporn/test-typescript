/**
 * ตัวแปรที่อยู่ใน class จะต้อง assign ค่า default ไว้ เช่น 
 * สำหรับทุก type = undefined, 
 * สำหรับ number = 0, 
 * สำหรับ string = ''
 */
// class Point {
// //   x: number | undefined;
// //   y: number | undefined;
//   x: number = 0
//   y: number = 0
// }

// const point = new Point()
// point.x = 10
// point.y = 20
// console.log(`${point.x} --Hello-- ${point.y}`)

/**
 * การกำหนดตัว constructor ไว้ใน class เป็นการบังคับว่าจะต้อง assign ค่า default ให้กับตัวแปรใน class
 **/
// class Point {
//   x: number = 0
//   y: number = 0
//   constructor(x: number, y: number){
//     this.x
//     this.y
//   }
// }
// const point = new Point(60,40)
// console.log(`${point.x} --Hello-- ${point.y}`)


/**
 * ถ้าใน constructor มีการกำหนดค่าไว้ให้อยู่แล้ว เวลาเรียกใช้ก็ไม่จำเป็นต้อง assign ค่าให้ก็ได้
 * readonly จะไม่สามารถแก้ไขได้ จะอ่านได้อย่าเดียว 
*/
// class Point {
//   x: number | undefined
//   y: number | undefined
//   readonly version: string = "1.0.1"
//   constructor(x: number = 0, y: number = 0){
//     this.x = x
//     this.y = y
//     console.log("Hello in class point") // จะทำงานก่อน console.log() ด้านนอก
//   }
// }
// const point1 = new Point()
// console.log(`Ponit1: ${point1.x} --Hello-- ${point1.y}`)

// // สามารถแก้ไขค่า default ได้จากการประกาศการเรียกใช้
// const point2 = new Point(20,40)
// console.log(`Ponit2: ${point2.x} --Hello-- ${point2.y}`)

// // ยังสามารถเปลี่ยน ค่า x,y ได้อยู่
// point2.x = 10 
// point2.y = 20
// console.log(`Ponit2(change value): ${point2.x} --Hello-- ${point2.y}`)

/**
 * Overload by class
 */
// class Point {
//   // Overloads
//   constructor(x: number, y: string);
//   constructor(s: string);
//   constructor(xs: any, y?: any) {
//     if (y !== undefined){
//         console.log("I'm", y, "and", xs, "year old")
//     } else {
//         console.log("Hello!!,", xs)
//     }
//   }
// }
// const point1 = new Point(24,"Noeii")
// const point2 = new Point("Noeii")


/**
 * Overload by function
 */
// function add(a:string, b:string):string

// function add(a:number, b:number): number

// function add(a: any, b:any): any {
//     return a + b;
// }

// console.log(add("Noeii ", "t."))
// console.log(add(55, 157))
// // console.log(add("Noeii", 157))


/** 
 * Setter Getter
 */ 
class Point {
    // _x: number = 0;
    _x = 0;
    
    get x() {
        this._x += 1
        return this._x;
    }
    
    // set x(value: number) {this._x = value}
    set x(value) {
        this._x = value;
    }
}

const p = new Point()
console.log(p.x)

p.x = 10
console.log(p.x)

p._x = 12
console.log(p.x)
// หลังจากตรงนี้ค่าจะ +1 ในทุก console.log เพราะใน get x() มีการ +1 ไว้
console.log(p.x)
console.log(p.x)
console.log(p.x)

/**
 * Extends
 */
class Person {
    name: string = ""
    constructor(name: string){
        this.name = name
    }
    sayHi() {
        console.log(`Hi, I'm ${this.name}`)
    }
}

class Employee extends Person {
    salary:number = 0
    constructor(name: string, salary: number){
        super(name)
        this.salary = salary
    }

    sayHi() {
        super.sayHi()
        console.log(`Salary: ${this.salary} baht`)
    }
}

const person = new Employee("Noeii", 26000)
// /**
//  * ถ้า comment func sayHi() ใน class Employee แต่ func sayHi() ใน class Person ก็จะแสดงมาอยู่ดี
//  * ถ้า comment super.sayHi() ใน func sayHi() ใน class Employee จะไม่แสดง func sayHi() ใน class Person
//  * */
person.sayHi()


/**
 * Abstract
 * จะไม่สามารถเอามาเป็น class ได้เลย ด้วยตัวมันเอง
 * ไม่มีรูปแบบวิธีการทำงาน
 */
abstract class Charactor {
    public name: string |undefined
    public damage: number = 0
    public attackSeed: number = 0
    constructor(name: string, damage: number, speed: number){
        this.name = name
        this.damage = damage
        this.attackSeed = speed
    }

    public abstract damagePerSecond(): number 
}


 class Goblin extends Charactor{
    constructor(name: string, damage: number, speed: number){
        super(name, damage, speed)
    }

    public damagePerSecond(): number {
        return this.damage * this.attackSeed
    }
}