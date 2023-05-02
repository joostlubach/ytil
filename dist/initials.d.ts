export type InitialsDerivable = string | {
    name: string;
} | {
    firstName: string;
    lastName?: string | null;
};
export declare function deriveInitials(arg: InitialsDerivable): string;
