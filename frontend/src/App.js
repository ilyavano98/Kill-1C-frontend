import {
    createContext,
    useContext,
    useState,
    React,
    useCallback,
    useEffect
} from "react";
import {
    BrowserRouter as Router, Navigate,
    Route,
    Routes
} from "react-router-dom";
import 'react-circular-progressbar/dist/styles.css';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import {Dashboard} from "./components/dashboard/Dashboard";
import {Login} from "./components/general/Login";
import {PrivateRoute} from "./components/general/PrivateRoute";
import {AuthProvider} from "./components/AuthProvider";

import {logout} from "./app/slices/auth";
import {Sidebar} from "./components/sidebar";
import {Header} from "./components/header";
import {Clients} from "./components/clients/Clients";
import {Cars} from "./components/cars/Cars";
import {Services} from "./components/servises/Services";
import {Empoyees} from "./components/employees/Empoyees";
import {Appointments} from "./components/appointments/Appointments";
import {Shifts} from "./components/shifts/Shifts";
import {Carwashes} from "./components/carwashes/Carwashes";
import {Washbays} from "./components/washbays/Washbays";
import {LoadDashboard} from "./components/loadDashboard/LoadDashboard";
import {MainContents} from "./components/MainContents";
import {Logout} from "./components/general/Logout";

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
        <>
            {/*оборачиваем компонент в Router, чтобы использовать роутинг*/}
            <Router>
                <Routes>
                    {/* обычные маршруты */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    {/* перехват всех остальных маршрутов */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>

                {/* используем контекст для передачи значения isAuthenticated и функции setAuth вниз по иерархии компонентов */}
                <AuthProvider>
                    <MainContents>
                        <Routes>
                            {/* защищённые маршруты */}
                            <Route element={<PrivateRoute />}>
                                {/*<Route path="/admin" element={<Admin />} />*/}
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/clients" element={<Clients />} />
                                <Route path="/cars" element={<Cars />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/employees" element={<Empoyees />} />
                                <Route path="/appointments" element={<Appointments />} />
                                <Route path="/shifts" element={<Shifts />} />
                                <Route path="/carwashes" element={<Carwashes />} />
                                <Route path="/washbays" element={<Washbays />} />
                                <Route path="/load-dashboard" element={<LoadDashboard />} />
                            </Route>
                        </Routes>
                    </MainContents>
                </AuthProvider>
            </Router>
        </>
    );
}