import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router"
import Schedule from "./schedule/Schedule.tsx";


function createBasicAuthHeader(username, password) {
    const credentials = `${username}:${password}`;
    const encoded = btoa(credentials);
    return `Basic ${encoded}`;
}

const username = 'admin';
const password = 'password';
export const authHeader = createBasicAuthHeader(username, password);


createRoot(document.getElementById('root')!).render(
    <StrictMode>
          <BrowserRouter>
              <Routes>
                  <Route path="/login" element={(<p>TEST</p>)} />
                  <Route path="/signup" element={(<App />)} />
                  <Route path="/calendar" element={(<Schedule />)}/>
              </Routes>
          </BrowserRouter>
    </StrictMode>,
)
