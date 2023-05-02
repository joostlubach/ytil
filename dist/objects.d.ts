export declare function objectEquals(left: Record<string, any> | null | undefined, right: Record<string, any> | null | undefined, equals?: (a: any, b: any) => boolean): boolean;
export declare function modifyObject<T extends Record<string, any>>(root: T, path: string, modifier: (value: any) => any): T;
export declare function modifyObject<T extends Record<string, any>>(root: T[], path: string, modifier: (value: any) => any): T[];
export declare function modifyObject<T extends Record<string, any>>(root: T | T[], path: string, modifier: (value: any) => any): T | T[];
export declare function modifyInObject<R extends Record<string, any>>(root: R, path: string, modify: ModifyInObjectCallback<R>): boolean;
export type ModifyInObjectCallback<R extends Record<string, any>> = <T>(value: T, parent: any, key: string | number, root: R) => void | boolean;
export declare function deepMapKeys(arg: any, fn: (key: string | symbol) => any): any;
export declare function deepMapValues(arg: any, fn: (value: any) => any): any;
