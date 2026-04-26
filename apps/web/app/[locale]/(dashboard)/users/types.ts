export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    roles: {
        role: {
            name: string;
            slug: string;
        };
    }[];
}