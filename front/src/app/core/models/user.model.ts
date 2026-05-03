export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}
export enum IdentityProvider {
    LOCAL = 'DATABASE',
    GOOGLE = 'GOOGLE',
    FACEBOOK = 'FACEBOOK',
    GITHUB = 'GITHUB'
}

export interface UserDTO {
    id?: string;
    email: string;
    username: string;
    roles: Role[];
    imageUrl?: string;
    providers?: IdentityProvider[];
}

export interface BaseApiResponse<T> {
    message: string;
    data: T;
}

export interface DataBaseLoginRequest {
    email: string;
    password?: string;
}

export interface DataBaseRegistrationRequest {
    email: string;
    username: string;
    password?: string;
}
