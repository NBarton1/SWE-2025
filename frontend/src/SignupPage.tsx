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
import {useCallback} from "react";
import {signup} from "./request/signup.ts";
import {login} from "./request/login.ts";
import {useNavigate} from "react-router";


interface SignupPageProps {
    setJwt: React.Dispatch<React.SetStateAction<string>>;
}

const SignupPage = ({ setJwt }: SignupPageProps) => {
    const theme = useMantineTheme(); // access Mantine theme

    const navigate = useNavigate()

    const form = useForm({
        initialValues: { name: "", username: "", password: "" },
        validate: {
            name: (value) => (value.trim().length < 2 ? "Name must have at least 2 characters" : null),
            username: (value) => (value.trim().length < 3 ? "Username must be at least 3 characters" : null),
            password: (value) => (value.length < 8 ? "Password must be at least 8 characters" : null),
        },
    });

    const handleSignup = useCallback(async () => {

        const signupRes = await signup({
            name: form.values.name,
            username: form.values.username,
            password: form.values.password,
        })

        if (!signupRes.ok) {
            return;
        }


        const loginRes = await login({
            username: form.values.username,
            password: form.values.password,
        })

        if (!loginRes.ok) {
            return;
        }

        const jwt = await loginRes.text()
        setJwt(jwt)

        navigate("/calendar")

    }, [form.values.name, form.values.password, form.values.username, navigate, setJwt]);

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
                <Title order={2} ta="center" mb="lg">
                    Create an Account
                </Title>

                <form onSubmit={form.onSubmit(handleSignup)}>
                    <Stack>
                        <TextInput
                            label="Full Name"
                            placeholder="Enter your name..."
                            {...form.getInputProps("name")}
                            required
                        />

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
                            Sign Up
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default SignupPage;
