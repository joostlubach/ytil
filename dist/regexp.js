import { escapeRegExp, isFunction } from 'lodash';
export function patternToRegExp(pattern, options = {}) {
    let regExpPattern = escapeRegExp(pattern);
    if (options.wildcards) {
        regExpPattern = regExpPattern.replace(/\\\*/g, '(.*?)');
    }
    if (options.anchor !== false) {
        regExpPattern = `^${regExpPattern}$`;
    }
    return new RegExp(regExpPattern, options.modifiers);
}
export function parseRegExp(pattern) {
    if (/^\/(.*)\/([img]+)?$/.test(pattern)) {
        return new RegExp(RegExp.$1, RegExp.$2);
    }
    else {
        return new RegExp(pattern);
    }
}
export function tryRegExp(subject, regExp, parse) {
    const match = subject.match(regExp);
    return match == null ? null : parse(match);
}
export function switchRegExp(subject, entries, defaultValue) {
    for (const [regExp, parse] of entries) {
        const match = subject.match(regExp);
        if (match == null) {
            continue;
        }
        return parse(match);
    }
    return isFunction(defaultValue) ? defaultValue() : defaultValue;
}
