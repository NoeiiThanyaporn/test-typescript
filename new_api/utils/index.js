"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOptionsHandler = exports.extractArray = exports.extractRecord = exports.booleanField = exports.booleanParser = exports.dateField = exports.dateParser = exports.intField = exports.intParser = exports.floatField = exports.floatParser = exports.stringField = exports.stringParser = exports.noParseParser = exports.requiredField = exports.etagHeader = exports.intoExpressHandler = void 0;
const crypto_1 = require("crypto");
const HASH_ALGORITHM = "sha256";
const CACHE_AGE = 15 * 60;
function isOpenWhiskWebResult(obj) {
    if (obj.statusCode !== undefined)
        return true;
    return false;
}
function isOpenWhiskWebError(obj) {
    if (obj.error !== undefined && obj.error.statusCode !== undefined)
        return true;
    return false;
}
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
function intoExpressHandler(fn, env = {}, extractor = () => ({}), cacheable = true) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let jsonParams = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.params), req.query), req.body), env), { clientIp: req.get('true-client-ip') }), (yield Promise.resolve(extractor(req))));
            let result = yield Promise.resolve(fn(jsonParams));
            if (result === undefined) {
                res.status(204);
            }
            else {
                if (isOpenWhiskWebResult(result)) {
                    res.status(result.statusCode);
                    res.header(result.headers);
                    res.send(result.body);
                }
                else if (isOpenWhiskWebError(result)) {
                    res.status(result.error.statusCode);
                    res.send(result.error.message);
                }
                else if (req.method.toLowerCase() === "get" && cacheable) {
                    let hasher = (0, crypto_1.createHash)(HASH_ALGORITHM);
                    hasher.update(JSON.stringify(result));
                    let etag = hasher.digest("base64");
                    if (etag === etagHeader(req)) {
                        res.sendStatus(304);
                    }
                    else {
                        res.status(200).set("ETag", `"${etag}"`).set("Cache-Control", `private, max-age=${CACHE_AGE}`);
                        res.send(result);
                    }
                }
                else {
                    res.send(result);
                }
            }
            next();
        }
        catch (e) {
            if (fn.name !== undefined) {
                console.error(`${(new Date()).toISOString()} - An error has been thrown from`, fn.name);
            }
            if (typeof (e === null || e === void 0 ? void 0 : e.toJSON) === "function") {
                e = e.toJSON();
            }
            if (((_a = e === null || e === void 0 ? void 0 : e.error) === null || _a === void 0 ? void 0 : _a.statusCode) !== undefined) {
                res.status(e.error.statusCode).send(e.error.message);
            }
            else if ((e === null || e === void 0 ? void 0 : e.statusCode) !== undefined) {
                res.status(e.statusCode).send(e.code);
            }
            else {
                return next(e);
            }
        }
    });
}
exports.intoExpressHandler = intoExpressHandler;
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
function etagHeader(req) {
    let etag = req.get("if-none-match");
    if (etag !== undefined)
        if (etag.startsWith("W/\"")) {
            return etag.slice("W/\"".length, etag.length - 1);
        }
        else {
            return etag.slice(1, etag.length - 1);
        }
    else
        return etag;
}
exports.etagHeader = etagHeader;
function requiredField(fn = noParseParser) {
    return ({ key, value }) => {
        if (value === undefined || value === null)
            throw {
                error: {
                    statusCode: 422,
                    message: `Missing required field. "${key}" field is required.`
                }
            };
        return fn({ key, value });
    };
}
exports.requiredField = requiredField;
/** Standard parser. It simply pass through the value back. */
function noParseParser({ value }) {
    return value;
}
exports.noParseParser = noParseParser;
/** Standard string parser. It invoke toString method on value. */
function stringParser({ value }) {
    return value !== undefined ? value.toString() : undefined;
}
exports.stringParser = stringParser;
/** Only accept string value and return string. If value is not undefined and it is any other type beside string, it throw error. */
function stringField({ value }) {
    if (value !== undefined && typeof value !== "string") {
        try {
            throw {
                statusCode: 422,
                message: `Expected string but found ${typeof value}`
            };
        }
        catch (e) {
            console.log("Error:", e);
        }
    }
    return value;
}
exports.stringField = stringField;
/** Standard float parser. It use parseFloat to parse value. If value is undefined, it return undefined instead of NaN. */
function floatParser({ value }) {
    return value !== undefined ? parseFloat(value) : undefined;
}
exports.floatParser = floatParser;
/** Only accept string value and return parsed float. If value is undefined, it return undefined instead of NaN. */
function floatField({ value }) {
    if (value !== undefined && typeof value !== "string" && typeof value !== "number") {
        throw {
            statusCode: 422,
            message: `Expected string or number but found ${typeof value}`
        };
    }
    return value !== undefined ? parseFloat(value) : undefined;
}
exports.floatField = floatField;
/** Standard int parser. It use parseInt to parse value. If value is undefined, it return undefined instead of NaN. */
function intParser({ value }) {
    return value !== undefined ? parseInt(value) : undefined;
}
exports.intParser = intParser;
/** Only accept string value and return parsed int. It use parseInt to parse value. If value is undefined, it return undefined instead of NaN. */
function intField({ value }) {
    if (value !== undefined && typeof value !== "string" && typeof value !== "number") {
        throw {
            statusCode: 422,
            message: `Expected string or number but found ${typeof value}`
        };
    }
    return value !== undefined ? parseInt(value) : undefined;
}
exports.intField = intField;
/** Standard date parser. It construct a Date object by passing value to Date constructor. */
function dateParser({ value }) {
    return value !== undefined ? new Date(value) : undefined;
}
exports.dateParser = dateParser;
/** Only accept string value and return parsed date. It construct a Date object by passing value to Date constructor. */
function dateField({ value }) {
    if (value !== undefined && typeof value !== "string") {
        throw {
            statusCode: 422,
            message: `Expected string but found ${typeof value}`
        };
    }
    return value !== undefined ? new Date(value) : undefined;
}
exports.dateField = dateField;
/** Standard boolean parser. It will return true only if value is a "true" string. It is case insensitive. */
function booleanParser({ value }) {
    return value !== undefined && value !== null ? value.toLowerCase() === "true" : undefined;
}
exports.booleanParser = booleanParser;
/** Only accept string or boolean value and return parsed boolean. It will return true only if value is a "true" string. It is case insensitive. */
function booleanField({ value }) {
    if (value !== undefined && typeof value !== "string" && typeof value !== "boolean") {
        throw {
            statusCode: 422,
            message: `Expected string or boolean but found ${typeof value}`
        };
    }
    return value !== undefined && value !== null ? value === "true" || value === true : undefined;
}
exports.booleanField = booleanField;
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
function extractRecord(obj, specs) {
    let result = {};
    for (let key of Object.keys(specs)) {
        const fn = specs[key];
        if (fn !== undefined)
            result[key] = fn({ key, value: obj[key] });
    }
    return result;
}
exports.extractRecord = extractRecord;
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
function extractArray(arr, specs) {
    return arr.map(object => {
        return extractRecord(object, specs);
    });
}
exports.extractArray = extractArray;
/**
 * A utilty function that overcome a bug of type definition which cause Express' HTTP options method requires third parameter due to
 * the problem that cors() function return a non conformant to type declaration of Express request handler.
 */
function makeOptionsHandler(corsOptions) {
    return (req, res, next) => {
        cors(corsOptions)(req, res, next);
    };
}
exports.makeOptionsHandler = makeOptionsHandler;
