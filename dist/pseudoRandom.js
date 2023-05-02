/* eslint-disable no-bitwise */
export function pseudoRandom(seedOrString, min, max) {
    if (max < min) {
        throw new Error("max must be grater than min");
    }
    if (max === min) {
        return min;
    }
    const seed = typeof seedOrString === 'number' ? seedOrString : stringHash(seedOrString);
    return min + seed % (max - min);
}
function stringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash >>>= 0;
    }
    return hash;
}
