import { Paper, Title, Box, useMantineTheme } from "@mantine/core";
import { useNavigate } from "react-router";
import { useCallback } from "react";
import { signup } from "../../request/signup.ts";
import useLogin from "../../hooks/useLogin.tsx";
import CreateAccountForm from "./CreateAccountForm.tsx";

const SignupPage = () => {
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const { tryLogin } = useLogin();

    const handleSignup = useCallback(
        async (values: { name: string; username: string; password: string }) => {
            const signupRes = await signup(values);
            if (!signupRes.ok) return;

            await tryLogin(values.username, values.password);
        },
        [tryLogin]
    );

    return (
        <Box
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.colors[theme.primaryColor][theme.primaryShade as number], // use Mantine primary color
            }}
        >
            <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: 480 }}>
                <Title order={2} ta="center" mb="lg" data-testid="signup-title">
                    Create an Account
                </Title>

                <CreateAccountForm
                    onSubmit={handleSignup}
                    submitLabel="Sign Up"
                    onCancel={() => navigate("/login")}
                    cancelLabel="Login"
                />
            </Paper>
        </Box>
    );
};

export default SignupPage;
