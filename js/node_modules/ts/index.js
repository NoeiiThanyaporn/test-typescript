"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequest = void 0;
function sendRequest(request) {
    // console.log("Sending", request.url)
    if (request.payload)
        console.log("Sending", request.payload);
    else
        console.log("Invalid payload format");
}
exports.sendRequest = sendRequest;
//# sourceMappingURL=index.js.map