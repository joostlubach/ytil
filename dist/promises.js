import { isFunction } from 'lodash';
export function isPromise(arg, strict = true) {
    if (arg == null) {
        return false;
    }
    if (!isFunction(arg.then)) {
        return false;
    }
    if (strict && !isFunction(arg.catch)) {
        return false;
    }
    if (strict && !isFunction(arg.finally)) {
        return false;
    }
    return true;
}
export function wrapInPromise(arg) {
    if (isPromise(arg)) {
        return arg;
    }
    else {
        return Promise.resolve(arg);
    }
}
