import type {Team} from "./team.ts";

// @ts-ignore
export enum Role {
    ADMIN = "ADMIN",
    COACH = "COACH",
    PLAYER = "PLAYER",
    GUARDIAN = "GUARDIAN",
}

export interface Account {
    id: number;
    name: string;
    username: string;
    role: Role;
}

export interface Player {
    account: Account;
    guardian: Account;
    team?: Team;
    hasPermission: boolean;
    position?: string;
}

export interface Guardian {
    account: Account;
}

export interface Coach {
    account: Account;
    team?: Team;
    likes: number;
    dislikes: number;
}

export interface Admin {
    account: Account;
}
