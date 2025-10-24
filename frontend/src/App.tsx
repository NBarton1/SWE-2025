import {BrowserRouter, Route, Routes} from "react-router";
import Schedule from "./schedule/Schedule.tsx";
import SignupPage from "./SignupPage.tsx";
import LoginPage from "./LoginPage.tsx";
import TeamsPage from "./TeamsPage.tsx";
import Layout from "./Layout.tsx";

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