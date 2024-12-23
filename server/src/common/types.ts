/** Cause property of app error */
export type Cause = {
    path: string[],
    value: any,
    message?: string
}[];

export interface User {
    fName: string;
    lName: string;
    email: string;
    auth: {
        role: 'user' | 'admin';
        password: string;
        sessionToken: null | string
    }

    hashPassword(salt?: number): string;
    createSessionToken(): string;
};

export interface RegisterUserDTO {
    fName: string;
    lName: string;
    email: string;
    password: string;
};

export interface LoginUserDTO {
    email: string;
    password: string;
}