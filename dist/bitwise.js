/* eslint-disable no-bitwise */
export function hasBitmask(value, mask) {
    return (value & mask) === value;
}
