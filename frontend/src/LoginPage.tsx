import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Stack,
    useMantineTheme,
    Box
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {login} from "./request/login.ts";
import {useCallback} from "react";
import {useNavigate} from "react-router";


interface LoginProps {
    setJwt: React.Dispatch<React.SetStateAction<string>>
}

const LoginPage = ({ setJwt }: LoginProps) => {

    const navigate = useNavigate();

    const theme = useMantineTheme(); // access Mantine theme

    const form = useForm({
        initialValues: { username: "", password: "" },
    });

    const handleLogin = useCallback(async () => {
        const res = await login({
                username: form.values.username,
                password: form.values.password
            })

        if (!res.ok) {
            return;
        }

        const jwt = await res.text()

        setJwt(jwt)

        navigate("/teams")

    }, [form.values.password, form.values.username, navigate, setJwt]);

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
                <Title order={2} ta="center" mb="lg">
                    Log In
                </Title>

                <form onSubmit={form.onSubmit(handleLogin)}>
                    <Stack>
                        <TextInput
                            label="Username"
                            placeholder="Enter your username..."
                            {...form.getInputProps("username")}
                            required
                        />

                        <PasswordInput
                            label="Password"
                            placeholder="Enter your password..."
                            {...form.getInputProps("password")}
                            required
                        />

                        <Button fullWidth mt="md" type="submit" variant="filled">
                            Log In
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginPage;
