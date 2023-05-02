export declare function superConstructor(ctor: AnyConstructor): any;
export type AnyConstructor = Constructor<any>;
export type Constructor<T> = new (...args: any[]) => T;
export declare function createConstructorWithName<T extends Constructor<any>>(name: string, superConstructor?: T): T;
export declare function createConstructorWithName<T extends Constructor<any>>(name: string, superConstructor?: Function): T;
