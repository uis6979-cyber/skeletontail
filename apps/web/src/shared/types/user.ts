import type { Gender, Language } from "../enums/enums";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    birthDay?: string | null;
    phone?: string | null;
    gender?: Gender | null;
    language?: Language | null;
    password?: string;
    confirmPassword?: string;
};