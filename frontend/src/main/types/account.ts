import type {Role} from "./role.ts";

export interface Account {
    id: number
    name: string,
    username: string,
    picture: ArrayBuffer | null,
    email: string | null
    role: Role
}