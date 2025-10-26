import {BrowserRouter, Route, Routes} from "react-router";
import Schedule from "./components/schedule/Schedule.tsx";
import SignupPage from "./components/signup/SignupPage.tsx";
import LoginPage from "./components/login/LoginPage.tsx";
import TeamsPage from "./components/teams/TeamsPage.tsx";
import Layout from "./components/layout/Layout.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={(<LoginPage />)} />
                <Route path="/signup" element={(<SignupPage />)} />

                <Route element={<Layout/>}>
                    <Route path="/calendar" element={(<Schedule />)}/>
                    <Route path="/teams" element={(<TeamsPage />)}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App