import {
    createContext,
    useContext,
    useState,
    React,
    useCallback,
    useEffect
} from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {Settings} from "./components/settings/Settings";
import {Statistic} from "./components/home/Statistic";
import {Day} from "./components/main/calendar/Day";
import {Home} from "./components/general/Home";
import {Login} from "./components/general/Login";
import {PrivateRoute} from "./components/general/PrivateRoute";
import {AuthProvider} from "./components/AuthProvider";

import {logout} from "./app/slices/auth";

export function App(){
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const logOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    useEffect(() => {
        if (currentUser) {
            setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
            setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
        } else {
            setShowModeratorBoard(false);
            setShowAdminBoard(false);
        }
    }, [currentUser]);

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