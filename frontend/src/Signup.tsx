import {useCallback, useState} from "react";
import {Button, PasswordInput, Stack, TextInput} from "@mantine/core";

const Signup = () => {
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const signup = useCallback(async () => {
        await fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                username,
                password,
            })
        });
    }, [name, password, username]);

    return (
        <Stack w={300} mx="auto" mt="xl">
            <TextInput
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
            />
            <TextInput
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
            />
            <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button onClick={signup}>Sign Up</Button>
        </Stack>
    );
}

export default Signup;