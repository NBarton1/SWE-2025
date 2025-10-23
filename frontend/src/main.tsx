import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router"
import Schedule from "./schedule/Schedule.tsx";

// TODO: get this from login
export let token = "";


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
