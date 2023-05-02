import { cleanTextValue } from './text';
export function deriveInitials(arg) {
    let parts;
    if (typeof arg === 'string') {
        parts = arg.split(' ', 2);
    }
    else if ('firstName' in arg) {
        parts = [
            cleanTextValue(arg.firstName),
            cleanTextValue(arg.lastName),
        ].filter(Boolean);
    }
    else {
        parts = [arg.name];
    }
    return parts.map(part => part.slice(0, 1)).join('');
}
