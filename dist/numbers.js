export function safeParseFloat(arg, defaultValue = null) {
    const number = parseFloat(arg);
    return isNaN(number) ? defaultValue : number;
}
export function safeParseInt(arg, defaultValue = null, radix = 10) {
    const number = parseInt(arg, radix);
    return isNaN(number) ? defaultValue : number;
}
