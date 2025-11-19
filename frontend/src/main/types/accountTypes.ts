import type {Team} from "./team.ts";
import type {Content} from "./content.ts";

// @ts-expect-error erasable
export enum Role {
    ADMIN = "ADMIN",
    COACH = "COACH",
    GUARDIAN = "GUARDIAN",
    PLAYER = "PLAYER",
}

export interface Account {
    id: number
    name: string,
    username: string,
    picture: Content | null,
    email: string | null
    role: Role
}

export interface Player {
    account: Account;
    guardian?: Account;
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

function hasRole(account: Account | null, needs: Role): boolean {
    return account != null && roleHierarchy[account.role].includes(needs);
}

export function isAdmin(account: Account | null): boolean {
    return hasRole(account, Role.ADMIN);
}

export function isCoach(account: Account | null): boolean {
    return hasRole(account, Role.COACH);
}

export function isGuardian(account: Account | null): boolean {
    return hasRole(account, Role.GUARDIAN);
}

export function isPlayer(account: Account | null): boolean {
    return hasRole(account, Role.PLAYER);
}

export function accountEquals(a0: Account | null, a1: Account | null): boolean {
    return a0 != null && a1 != null && a0.id === a1.id;
}

const VALID_ROLES = new Set(Object.values(Role));

export function isValidRoleString(value: string): boolean {
    return VALID_ROLES.has(value as Role);
}

export function hasEditPermission(currentAccount: Account | null, account: Account | null): boolean {
    return currentAccount != null && ((account && account.id === currentAccount.id) || isAdmin(currentAccount))
}