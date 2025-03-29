import { createContext, useContext, useState, React } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    Outlet,
    useLocation,
    useNavigate,
    NavLink
} from "react-router-dom";
import 'react-circular-progressbar/dist/styles.css';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Sidebar} from "./components/sidebar";
import {MainMenu} from "./components/home/MainMenu";
import {Settings} from "./components/settings/Settings";
import {Statistic} from "./components/home/Statistic";
import {Day} from "./components/main/calendar/Day";
import {Home} from "./components/general/Home";
import {Login} from "./components/general/Login";
import {PrivateRoute} from "./components/general/PrivateRoute";
import {AuthProvider} from "./components/AuthProvider";

export function App(){
    return (
        // оборачиваем компонент в Router, чтобы использовать роутинг
        <Router>
            {/* используем контекст для передачи значения isAuthenticated и функции setAuth вниз по иерархии компонентов */}
            <AuthProvider>
                <Routes>
                    {/* обычные маршруты */}

                    <Route path="/login" element={<Login />} />

                    {/* защищённые маршруты */}
                    <Route element={<PrivateRoute />}>
                        {/*<Route path="/admin" element={<Admin />} />*/}
                        <Route path="/" element={<Home />} />
                        <Route path="/statistics" element={<Statistic />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/day" element={<Day />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}