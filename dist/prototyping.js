export function superConstructor(ctor) {
    const superProto = Object.getPrototypeOf(ctor.prototype);
    return superProto?.constructor ?? null;
}
export function createConstructorWithName(name, superConstructor) {
    // Yay I came up with a trick to create a class with a run-time name.
    // Assign the class to some object with the given name as key. Then extract it again and lo and behold, it
    // has a name!
    const ns = {
        [name]: class extends (superConstructor ?? Object) {
        },
    };
    return ns[name];
}
