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
import {useNavigate} from "react-router";
import { useLogin } from "../../hooks/useLogin.tsx";


const LoginPage = () => {
    const navigate = useNavigate();
    const { tryLogin } = useLogin()

    const theme = useMantineTheme(); // access Mantine theme

    const form = useForm({
        initialValues: { username: "", password: "" },
    });

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

                <form onSubmit={form.onSubmit(() => tryLogin(form.values.username, form.values.password))}>
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
