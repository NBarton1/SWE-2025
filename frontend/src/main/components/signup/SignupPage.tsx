import {
    Box,
    Button,
    Group,
    Paper,
    PasswordInput,
    Radio,
    RadioGroup,
    Stack,
    TextInput,
    Title,
    useMantineTheme
} from "@mantine/core";
import {useNavigate} from "react-router";
import {useCallback, useState} from "react";
import {signup} from "../../request/signup.ts";
import useLogin from "../../hooks/useLogin.tsx";
import {useForm} from "@mantine/form";
import {Role} from "../../types/accountTypes.ts";

const SignupPage = () => {
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const { tryLogin } = useLogin();
    const [accountType, setAccountType] = useState<string>(Role.PLAYER);

    const form = useForm({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: "",
        },

        validate: {
            name: (value) => (value.trim().length < 2 ? "Name must have at least 2 characters" : null),
            username: (value) => (value.trim().length < 3 ? "Username must be at least 3 characters" : null),
            email: (value) => (accountType === Role.GUARDIAN && !(value && /^\S+@\S+\.\S+$/.test(value)) ? "Invalid email address" : null),
            password: (value) => (value.length < 8 ? "Password must be at least 8 characters" : null),
        },
    });

    const handleSubmit = useCallback(
        async (values: { name: string; username: string; email: string; password: string }) => {
            const signupRes = await signup({ ...values, role: accountType });
            if (!signupRes.ok) return;

            await tryLogin(values.username, values.password);
        },
        [tryLogin, accountType]
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

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <RadioGroup
                            label="Account Type"
                            value={accountType}
                            onChange={(value) => {
                                setAccountType(value as Role);
                                if (value === Role.PLAYER) form.setFieldValue("email", "");
                            }}
                        >
                            <Radio value={Role.PLAYER} label="Player" />
                            <Radio value={Role.GUARDIAN} label="Guardian" />
                        </RadioGroup>

                        {accountType === Role.GUARDIAN && (
                            <TextInput label="Email" placeholder="Enter email" type="email"{...form.getInputProps("email")} required/>
                        )}
                        <TextInput label="Full Name" placeholder="Enter name" {...form.getInputProps("name")} required />
                        <TextInput label="Username" placeholder="Enter username" {...form.getInputProps("username")} required />
                        <PasswordInput label="Password" placeholder="Enter password" {...form.getInputProps("password")} required />

                        <Group mt="md" grow>
                            <Button type="submit" variant="filled">
                                Sign Up
                            </Button>
                            <Button variant="outline" onClick={() => navigate("/login")}>
                                Login
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default SignupPage;
