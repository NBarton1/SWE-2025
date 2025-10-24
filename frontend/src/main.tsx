import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createTheme, MantineProvider} from "@mantine/core";


const theme = createTheme({
    colors: {
        violet: [
            '#f3e5ff', '#e1bfff', '#c58cff', '#a75aff', '#8a26ff',
            '#6a0dad', '#5800a1', '#440084', '#310066', '#1d003f',
        ],
    },
    primaryColor: 'violet',
    primaryShade: 6,
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider
            theme={theme}
            defaultColorScheme="dark"
        >
            <App/>
        </MantineProvider>
    </StrictMode>,
)