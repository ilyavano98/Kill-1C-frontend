import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {Spinner} from "react-bootstrap";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Загрузка данных...</p>
    </div>;

    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== 'ROLE_ADMIN') return <Navigate to="/" replace />;

    return children;
};

export default AdminRoute;