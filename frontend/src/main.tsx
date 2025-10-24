import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {MantineProvider} from "@mantine/core";


function createBasicAuthHeader(username: string, password: string) {
    const credentials = `${username}:${password}`;
    const encoded = btoa(credentials);
    return `Basic ${encoded}`;
}

const username = 'admin';
const password = 'password';
export const authHeader = createBasicAuthHeader(username, password);


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider>
            <App/>
        </MantineProvider>
    </StrictMode>,
)