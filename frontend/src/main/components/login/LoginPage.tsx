import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Stack,
    useMantineTheme,
    Box, Group
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {login} from "../../request/login.ts";
import {useCallback} from "react";
import {useNavigate} from "react-router";


const LoginPage = () => {

    const navigate = useNavigate();

    const theme = useMantineTheme(); // access Mantine theme

    const form = useForm({
        initialValues: { username: "", password: "" },
    });

    const handleLogin = useCallback(async () => {
        const res = await login({
            username: form.values.username,
            password: form.values.password
        });

        if (!res.ok) {
            return;
        }

        navigate("/teams")

    }, [form.values.password, form.values.username, navigate]);

    return (
        <Box
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.colors[theme.primaryColor][theme.primaryShade as number],
            }}
        >
            <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: 480 }}>
                <Title order={2} ta="center" mb="lg" data-testid="login-title">
                    Log In
                </Title>

                <form onSubmit={form.onSubmit(handleLogin)}>
                    <Stack>
                        <TextInput
                            label="Username"
                            placeholder="Enter your username..."
                            {...form.getInputProps("username")}
                            data-testid="login-username"
                            required
                        />

                        <PasswordInput
                            label="Password"
                            placeholder="Enter your password..."
                            {...form.getInputProps("password")}
                            data-testid="login-password"
                            required
                        />

                        <Group mt="md" grow>
                            <Button
                                onClick={() => navigate("/signup")}
                                variant="outline"
                                data-testid="login-signup"
                            >
                                Sign Up
                            </Button>

                            <Button
                                type="submit"
                                variant="filled"
                                data-testid="login-submit"
                            >
                                Login
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginPage;
