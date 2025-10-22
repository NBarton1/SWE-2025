import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import Signup from "./Signup.tsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={(<p>TEST</p>)} />
                <Route path="/signup" element={(<Signup/>)} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
