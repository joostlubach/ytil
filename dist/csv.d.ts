export declare function csvArrayToJSON(values: any[][], options?: CSVArrayToJSONOptions): Record<string, any>[];
export interface CSVArrayToJSONOptions {
    fields?: string[];
    trim?: boolean;
    convert?: (field: string, value: any) => any;
}
