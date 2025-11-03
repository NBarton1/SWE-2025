import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import Schedule from "./components/schedule/Schedule.tsx";
import SignupPage from "./components/signup/SignupPage.tsx";
import LoginPage from "./components/login/LoginPage.tsx";
import TeamsPage from "./components/teams/TeamsPage.tsx";
import Layout from "./components/layout/Layout.tsx";
import LiveMatchEditPage from "./components/live_match/LiveMatchEditPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/signup" replace />} />
                <Route path="/login" element={(<LoginPage />)} />
                <Route path="/signup" element={(<SignupPage />)} />

                <Route element={<Layout/>}>
                    <Route path="/calendar" element={(<Schedule />)}/>
                    <Route path="/teams" element={(<TeamsPage />)}/>
                    <Route path="/live" element={(<LiveMatchEditPage matchId={1} />)}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App