export interface LoginRequest {
    username: string,
    password: string,
}

export const login = async (loginRequest: LoginRequest) => {
    return await fetch("http://localhost:8080/api/accounts/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginRequest),
    });
}