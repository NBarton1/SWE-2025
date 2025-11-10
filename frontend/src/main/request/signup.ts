export interface SignupRequest {
    name: string,
    username: string,
    email: string,
    password: string,
    role: string;
}

export const signup = async (signupRequest: SignupRequest) => {
    return await fetch("http://localhost:8080/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupRequest),
    });
};
