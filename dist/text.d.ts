export declare function cleanTextValue(value: string | null | undefined, trim?: boolean): string | null;
export declare function stringContains(string: string, word: string): boolean;
export declare function slugify(text: string): string;
export declare function stringHash(str: string): number;
export declare function truncate(text: string, length: number, options: TruncateOptions): string;
export interface TruncateOptions {
    omission?: string;
    anchor?: 'start' | 'middle' | 'end';
}
