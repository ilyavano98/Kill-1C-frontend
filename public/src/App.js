import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Cars from './pages/Cars';
import Services from './pages/Services';
import Employees from './pages/Employees';
import Appointments from './pages/Appointments';
import Shifts from './pages/Shifts';
import CarWashes from './pages/CarWashes';
import WashBays from './pages/WashBays';
import LoadDashboard from './pages/LoadDashboard';
import {Provider} from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import configReducer from './features/config/configSlice'; // ваш слайс
import { NotificationProvider } from './components/NotificationProvider';
import Settings from "./pages/Settings";
import WidgetEditor from "./pages/WidgetEditor";
import AdminRoute from "./components/AdminRoute";

// Создаём store
const store = configureStore({
    reducer: {
        config: configReducer,
        // здесь могут быть другие редюсеры, если они есть
    },
});
function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <AuthProvider>
                    <NotificationProvider>
                        <Routes>
                            <Route path="/landing" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/clients" element={<Clients />} />
                                <Route path="/cars" element={<Cars />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/employees" element={<Employees />} />
                                <Route path="/appointments" element={<Appointments />} />
                                <Route path="/shifts" element={<Shifts />} />
                                <Route path="/carwashes" element={<CarWashes />} />
                                <Route path="/washbays" element={<WashBays />} />
                                <Route path="/load-dashboard" element={<LoadDashboard />} />
                                <Route path="/settings" element={
                                    <AdminRoute>
                                        <Settings />
                                    </AdminRoute>
                                } />
                                <Route path="/settings/widgets" element={
                                    <AdminRoute>
                                        <WidgetEditor />
                                    </AdminRoute>
                                } />
                            </Route>

                            <Route path="*" element={<Navigate to="/landing" replace />} />
                        </Routes>
                    </NotificationProvider>
                </AuthProvider>
            </Provider>
        </BrowserRouter>
    );
}

export default App;