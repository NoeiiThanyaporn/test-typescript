"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receive = void 0;
const _1 = require(".");
// sendRequest({url: "aaa"})
// sendRequest({
//     payload: [{
//         id: "some id",
//         name: "some name"
//     },
//     {
//         id: "some id 2",
//         name: "some name 2"
//     }
// ]
// })
function receive() {
    (0, _1.sendRequest)({
        payload: [
            {
                id: "some id",
                name: "some name",
            },
            {
                id: "some id 2",
                name: "some name 2",
            },
        ],
    });
}
exports.receive = receive;
receive();
//# sourceMappingURL=moda.js.map