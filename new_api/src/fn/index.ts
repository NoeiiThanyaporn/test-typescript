


// export function getObject ({pathStorage, bucket, prefix}: ObjectDescriptor)

export function readObject({cos, bucket, key}: ObjectDescriptor): Promise<S3.Body> {
  return new Promise((resolve, reject) => {
    cos.getObject({
      Bucket: bucket,
      Key: key
    }, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      if (data.Body)
        resolve(data.Body)
      else
        resolve({Body: ""})
    })
  })
}

export async function readJson<T>({cos, bucket, key}: ObjectDescriptor, reviver?: (key: string, value: string) => any): Promise<T>{
  let object: S3.Body
  try {
    object = await readObject({cos, bucket, key})
  } catch(e) {
    throw e
  }
  return JSON.parse(object.toString(), reviver)
}

export type ListPostsRequest = {
    userID: Number;
  id: Number;
  title: String; 
  body: String;
}

type PostData = {
  userID: Number;
  id: Number;
  title: String; 
  body: String;
}

export function 
export async function listPostData({id, title, body}:ListPostsRequest): Promise<PostData>  {
  let prefix = `posts/${id}`
  let name: string = person.firstname + " " + person.lastname
  if (person.nickname !== undefined) {
    name = person.nickname
  } 
  return name
}