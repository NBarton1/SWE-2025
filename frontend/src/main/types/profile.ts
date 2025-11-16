export interface ProfileUpdateForm {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    picture: File | null;
}