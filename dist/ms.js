import { ms as msOrig } from 'ms';
export function ms(input) {
    if (typeof input === 'string') {
        return msOrig(input);
    }
    else {
        return input;
    }
}
