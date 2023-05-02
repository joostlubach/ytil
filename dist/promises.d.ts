export interface PromiseLike<R> {
    then: Promise<R>['then'];
}
export declare function isPromise<R>(arg: any, strict: false): arg is PromiseLike<R>;
export declare function isPromise<R>(arg: any, strict?: true): arg is Promise<R>;
export declare function wrapInPromise<T>(arg: T | Promise<T>): Promise<T>;
