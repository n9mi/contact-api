export type RegisterRequest = {
    username: string,
    name: string
    password: string,
}

export type LoginRequest = {
    username: string,
    password: string
}

export type TokenResponse = {
    token: string
}

export type UserLocals = {
    username: string
}