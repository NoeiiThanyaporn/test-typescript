// >> condition <<
// // else-if
// if (true && false) console.log("Always Excuted.");
// else if (false) console.log("Never Exwcuted 1.2.");
// else console.log("Always Exwcuted 1.2.");

import { randomInt } from "crypto"

// // if
// if (false || true) console.log("Never Excuted.");

// // switch
// let selectMenu: number = 10;
// switch (selectMenu - 5) {
//   case 0:
//     console.log("Hello I'm Noeii");
//     break;
//   case 1:
//     console.log("Noeii th.");
//     break;
//   case 2:
//     console.log("Hello typescript");
//     break;
//   default:
//     console.log("Hello world!!!");
//     break;
// }

// **==========================================**

// >> loop <<
// // for i
// for (let i = 0; i < 5; i++) {
//   var output = "";
//   for (let j = 0; j < i; j++) {
//     output += "*";
//   }
//   console.log(output);
// }

// let foods = ["Pizza", "Burger", "Fries"];

// // loop-in --> index
//   console.log("=== Loop for-in ===");
// for (let index in foods) {
//   console.log(index, ":", foods[index]);
// }

// // loop-of --> data
//   console.log("=== Loop for-of ===");
// for (let item of foods) {
//   console.log(item);
// }

// // while --> loop when true
// let randomNum: number = randomInt(1000)
// let count: number = 0

// console.log("random number: ",randomNum) 
// if (randomNum > 700) randomNum = 500
// while(randomNum <= 700 && randomNum !== 0 && randomNum > -1)
// {
//     if (randomNum > 500)   {
//         console.log(randomNum, " Dollar")
//         randomNum -= 500
//     }    else if (randomNum > 10 && randomNum <= 90) {
//         console.log(randomNum," cats"),
//         randomNum += 100
//     }    else {
//         console.log("number is :",randomNum) 
//         randomNum -= 199
//     }

//     count++
// }
// console.log("count loop: ",count) 


// do-while --> do 1 time before; loop when true
class Animal {
  species?: string;
  name?: string[];
}

let animals = new Animal()
let countLoop: number = 0

do {
   if (countLoop === 100)  {
    animals.species = "cat"
    animals.name = []
   } else if (countLoop === 200) {
    animals.species = "dog"
   } 


    if (animals.species === undefined) {
     console.log("animals.species : ", animals.species)
     console.log("animals.name : ", animals.name)
    }

   if (animals.species === "dog" && countLoop === 200) {
     console.log("animals.species === dog")
     animals.name = ['Toong-Muan', 'Toong-Som']
     console.log(countLoop, ":", animals.name)
     break
   }

   if (animals.name === null) console.log("animals.name is Null : ", animals.name)

   countLoop += 50

   console.log(countLoop, "name:", animals.name)


} while (countLoop !== 500);
