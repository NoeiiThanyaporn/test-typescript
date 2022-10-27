type Person = {
  firstname: string
  lastname: string
  nickname?: string
  gender?: string 
  birthDate?: Date
};

type Contact = {
  email?: string
  phone: string
}

export function fullname(person: Person): string {
  return person.firstname + " " + person.lastname;
}

export function nameOfUser(person: Person): string {
  let name: string = person.firstname + " " + person.lastname
  if (person.nickname !== undefined) {
    name = person.nickname
  } 
  return name
}

// type any
function nameFromUser(name: any, lastname: any): any {
  let person1: Person = {
    firstname: "",
    lastname: "",
  };

  console.log(
    typeof person1.firstname === typeof name &&
      typeof person1.lastname === typeof lastname
  );

  if (
    typeof person1.firstname === typeof name &&
    typeof person1.lastname === typeof lastname
  ) {
    person1.firstname = name;
    person1.lastname = lastname;
  } else {
    person1.firstname = "None";
    person1.lastname = "None";
  }

  return person1;
}

// function sum(a: number, b: number, ...rest: number[]): number {
//   return a + b + rest.reduce((a, b) => a + b, 0);
// }
// console.log(sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));

// function add({ x, y }: { x: number; y: number }): number {
//   return x + y;
// }
// console.log(add({ x: 5, y: 100 }));
