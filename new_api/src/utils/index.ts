import cors from 'cors'
import { Response, Request, RequestHandler, NextFunction } from 'express'
import { createHash } from 'crypto'
import { CorsOptions } from 'cors'

export type RawFn<ARGS extends Json, RET> = (args: ARGS) => RET
export type Json = {[key: symbol]: string | number | Json}
export type CustomExtractorFn<R extends Request, T> = SyncCustomExtractorFn<R, T> | AsyncCustomExtractorFn<R, T>
export type SyncCustomExtractorFn<R extends Request, T> = (req: R) => T
export type AsyncCustomExtractorFn<R extends Request, T> = (req: R) => Promise<T>

const HASH_ALGORITHM = "sha256"
const CACHE_AGE = 15 * 60 

function isOpenWhiskWebResult(obj: any): obj is {statusCode: number, body?: any, headers?: {[key: string]: any}} {
  if (obj.statusCode !== undefined) return true
  return false
}
function isOpenWhiskWebError(obj: any): obj is {error: {statusCode: number, message?: string}} {
  if (obj.error !== undefined && obj.error.statusCode !== undefined) return true
  return false
}

export type NonZero<T extends number> = T extends 0?never:T


/** 
 * Higher-order function that convert any function that take single JSON alike argument into Express request handler. 
 * 
 * By default, this function extract data from `req` object of request handler.
 * It merges data from path paremeter first then request query then request body.
 * If data with the same key appear in multiple place, such as in both query and body, subsequence merge will overwrite previous one thus
 * body value will overwrite query value in merged data.
 * 
 * This function take some positional arguments to construct a handler.
 * 
 * - The first argument is the function itself to perform task.
 * - The second argument is an object. This object will be merged to prior merged data mentioned above. If the object contains 
 * duplicate key to request's path, query, or body, it will overwrite those keys in merged data.
 * - The third argument is an extractor. This function take Express `req` as parameter. It should return an object which will be 
 * merge into data that will be consume by the original function. If the return object contains duplicate key to previously merged data, 
 * it will overwrite those keys in merged data. This function can also be used to map a params/query to function props with different name.
 * 
 * Note: the second and third argument are evaluate once before each request.
 * Take into account of this nature to evaluate the cost of each request processing.
 * 
 * @returns An Express request handler that will automatically call `next` after it's done its' task.
 */
export function intoExpressHandler<ARGS extends Json, RET>(
  fn: RawFn<ARGS, RET>, 
  env: Partial<{[K in keyof ARGS]: ARGS[K]}> = {}, 
  extractor: CustomExtractorFn<Request<ARGS & Record<string, any>, RET, ARGS & Record<string, any>, ARGS & Record<string, any>>, Partial<{[K in keyof ARGS]: ARGS[K]}>> = () => ({}),
  cacheable: boolean = true
): RequestHandler<ARGS, RET | string, ARGS, ARGS> {
  return async (req, res, next) => {
    try {
      let jsonParams: ARGS = {
        ...req.params,
        ...req.query,
        ...req.body,
        ...env,
        clientIp: req.get('true-client-ip'),
        ...(await Promise.resolve(extractor(req)))
      }
      let result = await Promise.resolve(fn(jsonParams))

      if (result === undefined) {
        res.status(204)
      } else {
        if (isOpenWhiskWebResult(result)) {
          res.status(result.statusCode)
          res.header(result.headers)
          res.send(result.body)
        } else if (isOpenWhiskWebError(result)) {
          res.status(result.error.statusCode)
          res.send(result.error.message)
        } else if (req.method.toLowerCase() === "get" && cacheable) {
          let hasher = createHash(HASH_ALGORITHM)
          hasher.update(JSON.stringify(result))
          let etag = hasher.digest("base64")
          if (etag === etagHeader(req)) {
            res.sendStatus(304)
          } else {
            res.status(200).set("ETag", `"${etag}"`).set("Cache-Control", `private, max-age=${CACHE_AGE}`)
            res.send(result)
          }
        } else {
          res.send(result)
        }
      }
      next()
    } catch (e: any) {
      if (fn.name !== undefined) {
        console.error(`${(new Date()).toISOString()} - An error has been thrown from`, fn.name)
      }
      if (typeof e?.toJSON === "function") {
        e = e.toJSON()
      }
      if (e?.error?.statusCode !== undefined) {
        res.status(e.error.statusCode).send(e.error.message)
      } else if (e?.statusCode !== undefined) {
        res.status(e.statusCode).send(e.code)
      } else {
        return next(e)
      }
    }
  }
}

// /** Extract standard HTTP header for access check. */
// export function standardSecurityHeader<T, U>(req: Request<T, U, T, T>) {
//   let headers : {accessToken?: string, key?: string} = {}
//   let accessToken = bearerTokenHeader(req)
//   if (accessToken !== undefined) headers.accessToken = accessToken
//   let key = req.get("client-key")
//   if (key !== undefined) headers.key = key
//   return headers
// }


/** Extract etag data from request header */
export function etagHeader<T, U>(req: Request<T, U, T, T>) {
  let etag = req.get("if-none-match")

  if (etag !== undefined)
    if (etag.startsWith("W/\"")) {
      return etag.slice("W/\"".length, etag.length - 1)
    } else {
      return etag.slice(1, etag.length - 1)
    }
  else return etag
}


/**
 * ตั้งแต่ตรงนี้ไปคือ Function สำหรับการ check typr of value ที่ส่งเข้ามา
 */
export type ParserSpecs = {
  [K : string]: (params: {key: string, value: any}) => any
}

/** General parser function signature. */
export type ParserFn<T = any> = (params: {key: string, value: any}) => T

/**
 * Mark a field a required field and assume that it is in a correct parsed type.
 * If it is undefined or null, it throw error with status code 422.
 * This is equivalence to calling `requiredField(noParseParser)`
 */
export function requiredField<T = any, U = T>(): (params: {key: string, value?: T}) => U

/** 
 * Make a field a required field. If it is undefined or null, it throw error with status code 422.
 * This function is used in conjunction with other parser function such as `stringParser`, `floatParser`, etc.
 */
export function requiredField<T = any, U = T >(fn: (params: {key: string, value: T}) => U): (params: {key: string, value: T}) => NonNullable<U>
export function requiredField<T = any>(fn = noParseParser): (params: {key: string, value: T}) => any {
  return ({key, value}: {key: string, value?: any}) => {
    if (value === undefined || value === null) throw {
      error: {
        statusCode: 422,
        message: `Missing required field. "${key}" field is required.`
      }
    }
    return fn({key, value}) 
  }
}

/** Standard parser. It simply pass through the value back. */
export function noParseParser<T = any>({value}: {key: string, value: T}) {
  return value
}
/** Standard string parser. It invoke toString method on value. */
export function stringParser({value}: {key: string, value?: any}): string {
  return value !== undefined?value.toString():undefined
}

/** Only accept string value and return string. If value is not undefined and it is any other type beside string, it throw error. */
export function stringField({value}: {key: string, value?: any}): string {
  if (value !== undefined && typeof value !== "string") {
    try {
      throw {
        statusCode: 422,
        message: `Expected string but found ${typeof value}`
      }
    } catch(e) {
      console.log("Error:", e)
    }
   
  }
  return value
}

/** Standard float parser. It use parseFloat to parse value. If value is undefined, it return undefined instead of NaN. */
export function floatParser({value}: {key: string, value?: any}) {
  return value !== undefined?parseFloat(value):undefined
}

/** Only accept string value and return parsed float. If value is undefined, it return undefined instead of NaN. */
export function floatField({value}: {key: string, value?: any}) {
  if (value !== undefined && typeof value !== "string" && typeof value !== "number") {
    throw {
      statusCode: 422,
      message: `Expected string or number but found ${typeof value}`
    }
  }
  return value !== undefined?parseFloat(value):undefined
}

/** Standard int parser. It use parseInt to parse value. If value is undefined, it return undefined instead of NaN. */
export function intParser({value}: {key: string, value?: any}) {
  return value !== undefined?parseInt(value):undefined
}

/** Only accept string value and return parsed int. It use parseInt to parse value. If value is undefined, it return undefined instead of NaN. */
export function intField({value}: {key: string, value?: any}) {
  if (value !== undefined && typeof value !== "string" && typeof value !== "number") {
    throw {
      statusCode: 422,
      message: `Expected string or number but found ${typeof value}`
    }
  }
  return value !== undefined?parseInt(value):undefined
}

/** Standard date parser. It construct a Date object by passing value to Date constructor. */
export function dateParser({value}: {key: string, value?: any}) {
  return value !== undefined?new Date(value):undefined
}

/** Only accept string value and return parsed date. It construct a Date object by passing value to Date constructor. */
export function dateField({value}: {key: string, value?: any}) {
  if (value !== undefined && typeof value !== "string") {
    throw {
      statusCode: 422,
      message: `Expected string but found ${typeof value}`
    }
  }
  return value !== undefined?new Date(value):undefined
}

/** Standard boolean parser. It will return true only if value is a "true" string. It is case insensitive. */
export function booleanParser({value}: {key: string, value?: any}) {
  return value !== undefined && value !== null?value.toLowerCase() === "true":undefined
}

/** Only accept string or boolean value and return parsed boolean. It will return true only if value is a "true" string. It is case insensitive. */
export function booleanField({value}: {key: string, value?: any}) {
  if (value !== undefined && typeof value !== "string" && typeof value !== "boolean") {
    throw {
      statusCode: 422,
      message: `Expected string or boolean but found ${typeof value}`
    }
  }
  return value !== undefined && value !== null?value === "true" || value === true:undefined
}

/** 
 * Extract JSON from given "record" using given spec. 
 * "record" is a type in Typescript. It's a type that work like a hash table or dictionary-alike object.
 * The index key is a string. The value for each index is a string.
 * 
 * This function extract fields defined in specs using respectively parser function.
 * Here's some pre-defined functions to do basic type conversion.
 * - `noParseParser`
 * - `stringParser`
 * - `floatParser`
 * - `intParser`
 * - `dateParser`
 * - `booleanParser`
 * 
 * For required field, the conversion function should be transformed by `requiredField` function.
 * When the required field is missing, it throw an error object that is understood by `intoExpressHandler`.
 * 
 * An example of usage:
 * ```
 * let props = extractRecord(
 *   {param2: "123", param3: "3.141", param5: "2022-07-21T09:35:31.820Z", param6: "456"}, 
 *   {param1: stringParser, param2: requiredField(stringParser), param3: floatParser, param4: intParser, param5: dateParser, param6({key, value}: {key: string, value: string}) { return {name: key, value}}}
 * )`
 * // props will be {param1: undefined, param2: "123", param3: undefined, param4: undefined, param5: 2022-07-21T09:35:31.820Z, param6: {name: "param6", value: "456"}}
 * ```
 * If `param2` is missing, it will throw {error: {statusCode: 422, message: 'Missing required field. "param2" field is required.'}}
 */
export function extractRecord<T extends ParserSpecs>(obj: Record<string, any>, specs: T) {
  let result: any = {}
  for (let key of Object.keys(specs)) {
    const fn = specs[key]
    if (fn !== undefined)
      result[key] = fn({key, value: obj[key]})
  }
  return result as {[K in keyof T]: ReturnType<T[K]>}
}
/**
 * Extract array of "record" using given spec.
 * "record" is a type in Typescript. It's a type that work like a hash table or dictionary-alike object.
 * The index key is a string. The value for each index is a string.
 * 
 * This function extract fields defined in specs using respectively parser function.
 * Here's some pre-defined functions to do basic type conversion.
 * - `noParseParser`
 * - `stringParser`
 * - `floatParser`
 * - `intParser`
 * - `dateParser`
 * - `booleanParser`
 * 
 * It is different from `extractRecord` that it iteratively parse each object in array using `extractRecord` function.
 */
export function extractArray<T extends ParserSpecs>(arr: Array<Record<string, any>>, specs: T) {
  return arr.map(object => {
    return extractRecord(object, specs)
  })
}

/** 
 * A utilty function that overcome a bug of type definition which cause Express' HTTP options method requires third parameter due to
 * the problem that cors() function return a non conformant to type declaration of Express request handler.
 */
export function makeOptionsHandler(corsOptions: CorsOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    cors(corsOptions)(req, res, next)
  }
}

