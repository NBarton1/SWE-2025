import type {Team} from "./team.ts";
import type {Content} from "./content.ts";

// @ts-expect-error erasable
export enum Role {
    ADMIN = "ADMIN",
    COACH = "COACH",
    PLAYER = "PLAYER",
    GUARDIAN = "GUARDIAN",
}

export interface Account {
    id: number
    name: string,
    username: string,
    picture: Content,
    email: string | null
    role: Role
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

const roleHierarchy: Record<Role, Role[]> = {
    [Role.ADMIN]: [Role.ADMIN, Role.COACH, Role.GUARDIAN],
    [Role.COACH]: [Role.COACH, Role.GUARDIAN],
    [Role.GUARDIAN]: [Role.GUARDIAN],
    [Role.PLAYER]: [Role.PLAYER],
};

function hasRole(account: Account, needs: Role): boolean {
    return roleHierarchy[account.role].includes(needs);
}

export function isAdmin(account: Account): boolean {
    return hasRole(account, Role.ADMIN);
}

export function isCoach(account: Account): boolean {
    return hasRole(account, Role.COACH);
}

export function isGuardian(account: Account): boolean {
    return hasRole(account, Role.GUARDIAN);
}

export function isPlayer(account: Account): boolean {
    return hasRole(account, Role.PLAYER);
}

