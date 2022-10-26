export type Requet = {
  url?: string;
  payload: {
    id: string;
    name: string;

    
  }[];
};

export function sendRequest(request: Requet) {
  // console.log("Sending", request.url)
  if (request.payload && Array.isArray(request.payload))
    console.log("Sending", request.payload);
  else console.log("Invalid payload format");

  console.log("Paylode[]:", Array.isArray(request.payload)); // check param is Arr --> [] or [{}] == len(Arr) 0
}
