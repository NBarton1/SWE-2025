import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import Schedule from "./components/schedule/Schedule.tsx";
import SignupPage from "./components/signup/SignupPage.tsx";
import LoginPage from "./components/login/LoginPage.tsx";
import TeamStandings from "./components/teams/TeamStandings.tsx";
import TeamView from "./components/teams/TeamView.tsx";
import Layout from "./components/layout/Layout.tsx";
import MatchEditPage from "./components/match/MatchEditPage.tsx";
import MatchViewPage from "./components/match/MatchViewPage.tsx";
import Profile from "./components/profile/Profile.tsx";
import PostEditPage from "./components/post/PostEditPage.tsx";
import FeedPage from "./components/post/FeedPage.tsx";
import {type Account, isAdmin} from "./types/accountTypes.ts";
import {useEffect, useState} from "react";
import {getAccount} from "./request/accounts.ts";
import AdminAccountsPage from "./components/admin/AdminAccountsPage.tsx";
import ScheduleList from "./components/schedule/ScheduleList.tsx";
import {AuthContext} from "./hooks/useAuth.tsx";

function App() {
    const [currentAccount, setCurrentAccount] = useState<Account | null>(null)

    useEffect(() => {
        const idString = sessionStorage.getItem("account_id")
        const accountId = Number(idString)
        if (isNaN(accountId)) return

        getAccount(accountId).then(setCurrentAccount)
    }, []);

    return (
        <AuthContext.Provider value={{currentAccount, setCurrentAccount}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/signup" replace/>}/>
                    <Route path="/login" element={(<LoginPage/>)}/>
                    <Route path="/signup" element={(<SignupPage/>)}/>

                <Route element={<Layout />}>
                    <Route path="/calendar" element={(<Schedule />)}/>
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/teams" element={(<TeamStandings />)}/>
                    <Route path="/teams/:id" element={<TeamView />} />
                    <Route path="/create-post" element={(<PostEditPage />)} />
                    <Route path="/feed" element={(<FeedPage />)} />
                    <Route path="/live/:id" element={<MatchEditPage />} />
                    <Route path="/match/:id" element={(<MatchViewPage />)}/>
                    <Route path="/calendar/list" element={(<ScheduleList />)}/>

                        {isAdmin(currentAccount) && (
                            <Route path="/users" element={(<AdminAccountsPage/>)}/>
                        )}
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App