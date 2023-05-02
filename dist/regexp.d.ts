export interface PatternToRegExpOptions {
    anchor?: boolean | 'start' | 'end';
    wildcards?: boolean;
    modifiers?: string;
}
export declare function patternToRegExp(pattern: string, options?: PatternToRegExpOptions): RegExp;
export declare function parseRegExp(pattern: string): RegExp;
export declare function tryRegExp(subject: string, regExp: RegExp, parse: (match: RegExpMatchArray) => string): string | null;
export declare function switchRegExp<T>(subject: string, entries: Array<[RegExp, (match: RegExpMatchArray) => T]>): T | undefined;
export declare function switchRegExp<T>(subject: string, entries: Array<[RegExp, (match: RegExpMatchArray) => T]>, defaultValue: T | (() => T)): T;
