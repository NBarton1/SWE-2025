import {useCallback, useState} from 'react'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import Schedule from "./schedule/Schedule.tsx";

function App() {
    const [count, setCount] = useState(0)
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
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={(<p>TEST</p>)} />
                <Route path="/signup" element={(<p/>)} />
                <Route path="/calendar" element={(<Schedule />)}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
