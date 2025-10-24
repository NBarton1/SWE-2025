import {BrowserRouter, Route, Routes} from "react-router";
import Schedule from "./schedule/Schedule.tsx";
import SignupPage from "./SignupPage.tsx";
import LoginPage from "./LoginPage.tsx";
import {useState} from "react";
import TeamsPage from "./TeamsPage.tsx";
import Layout from "./Layout.tsx";

function App() {
    const [jwt, setJwt] = useState<string>("")

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