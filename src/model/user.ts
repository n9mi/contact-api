export type UserInfoResponse = {
    username: string,
    name: string
}

export type UserUpdateRequest = {
    username?: string,
    name?: string,
    password?: string
}