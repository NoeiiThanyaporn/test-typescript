"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequest = void 0;
function sendRequest(request) {
    // console.log("Sending", request.url)
    if (request.payload && Array.isArray(request.payload))
        console.log("Sending", request.payload);
    else
        console.log("Invalid payload format");
    console.log("Paylode[]:", Array.isArray(request.payload)); // check param is Arr --> [] or [{}] == len(Arr) 0
}
exports.sendRequest = sendRequest;
//# sourceMappingURL=index.js.map