export class Humen {
  name: string = ""
  lastname: string = ""
  age: number = 0

  sayHello() {
    return ("Hello ! I'm " + this.name + " " + this.lastname + " and " + this.age + "  years old"
    )
  }
}