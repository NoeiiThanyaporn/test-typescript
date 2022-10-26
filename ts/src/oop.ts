// class Point {
//   x: number;
//   y: number;
//   readonly version: string = "1.0.1"; // can't change
//   constructor(x: number = 0, y: number = 0) {
//     this.x = x;
//     this.y = y;
//     console.log("Hello");
//   }
// }

// const point = new Point();
// const point2 = new Point(10, 20);
// const point3 = new Point(10, 20);

// point3.x = 100;
// console.log(`${point.x} -Hello- ${point.y}`);
// console.log(`${point2.x} -Hello- ${point2.y}`);
// console.log(`${point3.x} -Hello- ${point3.y}`);

// class Point {
//   // Overloads
//   constructor(x: number, y: string);
//   constructor(s: string);
//   constructor(xs: any, y?: any){

//   }
// }

class Point {
  _x: number = 0;
  get x(): number {
    this._x += 1;
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }
}

const p = new Point();
p.x = 10;
console.log(p.x);
