export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface UserDTO {
    id?: string;
    email: string;
    username: string;
    roles: Role[];
    imageUrl?: string;
    provider?: string;
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
