// function sayHello(name: string, lastname: string): string {
//   return name + " " + lastname;
// }
// console.log(sayHello("Noeii", "T."));

// function sayHello2(name: string, lastname: string = "None"): string {
//   return name + " " + lastname;
// }
// console.log("Hello2 " + sayHello2("Noeii"));

type Person = {
  name: string;
  lastname: string;
};


class Person2 {
  name: string = ''
  lastname: string = ''
};

// type any
function sayHello3(name: any, lastname: any): any {
  let person1: Person = {
    name: "",
    lastname: "",
  };

  let person2: any = new Person2()

  console.log(
    typeof person1.name === typeof name &&
      typeof person1.lastname === typeof lastname
  );

  if (
    typeof person1.name === typeof name &&
    typeof person1.lastname === typeof lastname
  ) {
    console.log("3");
    person1.name = name;
    person1.lastname = lastname;
  } else {
    console.log("2");
    person1.name = "None";
    person1.lastname = "None";
  }
  console.log("3", person1);

  // let x = 2;

  return person1;
}
console.log("Hello3 " + sayHello3("Noeii", "T."));

// function sum(a: number, b: number, ...rest: number[]): number {
//   return a + b + rest.reduce((a, b) => a + b, 0);
// }
// console.log(sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));

// function add({ x, y }: { x: number; y: number }): number {
//   return x + y;
// }
// console.log(add({ x: 5, y: 100 }));
