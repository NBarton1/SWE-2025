import {BrowserRouter, Route, Routes} from "react-router";
import Schedule from "./schedule/Schedule.tsx";
import SignupPage from "./SignupPage.tsx";
import LoginPage from "./LoginPage.tsx";
import {useState} from "react";
import TeamsPage from "./TeamsPage.tsx";
import Layout from "./Layout.tsx";

function App() {
    let [jwt, setJwt] = useState<string>("")
    jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc2MTMxODg4MiwiaXNzIjoiRG9ua2V5S29uZyIsImV4cCI6MTc2MTMyMjQ4Mn0.w2xZSMwEzG7vuGkjglry6EDhJtpEgQ4qOx1mY__Rf2A"

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={(<LoginPage setJwt={setJwt}/>)} />
                <Route path="/signup" element={(<SignupPage setJwt={setJwt}/>)} />

                <Route element={<Layout/>}>
                    <Route path="/calendar" element={(<Schedule jwt={jwt}/>)}/>
                    <Route path="/teams" element={(<TeamsPage jwt={jwt}/>)}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App