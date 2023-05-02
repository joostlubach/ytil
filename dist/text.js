export function cleanTextValue(value, trim = false) {
    if (value == null) {
        return null;
    }
    if (trim) {
        value = value.replace(/^[\r\n\s\u{200B}]+|[\r\n\s\u{200B}]+$/gu, '');
    }
    return value === '' ? null : value;
}
export function stringContains(string, word) {
    return slugify(string).includes(slugify(word));
}
export function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFKD') // Remove accents
        .replace(/[\u0300-\u036f]/g, '') // Remove accents, part 2
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-|-$/g, '');
}
export function stringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        // eslint-disable-next-line no-bitwise
        hash = ((hash << 5) - hash) + chr;
        // eslint-disable-next-line no-bitwise
        hash >>>= 0;
    }
    return hash;
}
export function truncate(text, length, options) {
    const { omission = ' … ', anchor = 'start', } = options;
    if (text.length <= length) {
        return text;
    }
    const lengthPre = anchor === 'start' ? 0 :
        anchor === 'end' ? length :
            Math.ceil(length / 2 - omission.length / 2);
    const lengthPost = anchor === 'start' ? 0 :
        anchor === 'end' ? length :
            Math.floor(length / 2 - omission.length / 2);
    return text.slice(0, lengthPre) + omission + text.slice(-lengthPost);
}
