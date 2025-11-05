import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Schedule from "./components/schedule/Schedule.tsx";
import SignupPage from "./components/signup/SignupPage.tsx";
import LoginPage from "./components/login/LoginPage.tsx";
import TeamStandings from "./components/teams/TeamStandings.tsx";
import TeamView from "./components/teams/TeamView.tsx";
import Layout from "./components/layout/Layout.tsx";
import LiveMatchEditPage from "./components/live_match/LiveMatchEditPage.tsx";
import LiveMatchViewPage from "./components/live_match/LiveMatchViewPage.tsx";

import Profile from "./components/profile/Profile.tsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/signup" replace />} />
                <Route path="/login" element={(<LoginPage />)} />
                <Route path="/signup" element={(<SignupPage/>)}/>

                <Route element={<Layout />}>
                    <Route path="/calendar" element={(<Schedule />)}/>
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/teams" element={(<TeamStandings />)}/>
                    <Route path="/teams/:id" element={<TeamView />} />
                    <Route path="/live/:id" element={<LiveMatchEditPage />} />
                    <Route path="/match/:id" element={(<LiveMatchViewPage />)}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App