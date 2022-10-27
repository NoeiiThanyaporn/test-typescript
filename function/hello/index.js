"use strict";
function sayHello(name, lastname) {
    return name + " " + lastname;
}
console.log(sayHello("Noeii", "T."));
function sayHello2(name, lastname = "None") {
    return name + " " + lastname;
}
console.log("Hello2 " + sayHello2("Noeii"));
//# sourceMappingURL=index.js.map