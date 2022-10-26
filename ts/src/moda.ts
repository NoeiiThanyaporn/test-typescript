import { sendRequest } from ".";
// sendRequest({url: "aaa"})
sendRequest({
    payload: [{
        id: "some id",
        name: "some name"
    },
    {
        id: "some id 2",
        name: "some name 2"
    }
]
})

// export function receive() {
//   sendRequest({
//     payload: [
//       {
//         id: "some id",
//         name: "some name",
//       },
//       {
//         id: "some id 2",
//         name: "some name 2",
//       },
//     ],
//   });
// }

// receive(); 
