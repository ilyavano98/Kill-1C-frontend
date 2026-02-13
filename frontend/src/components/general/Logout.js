// components/LogoutPage.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../app/slices/auth';

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Диспатчим logout action
                await dispatch(logout()).unwrap();

                // После успешного выхода перенаправляем на нужную страницу
                navigate('/login', { replace: true });

                // Опционально: перезагрузить страницу для чистого состояния
                window.location.reload();
            } catch (error) {
                console.error('Logout failed:', error);
                navigate('/login', { replace: true });
            }
        };

        performLogout();
    }, [dispatch, navigate]);

    // Можно показать индикатор загрузки
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Выход из системы...</span>
            </div>
        </div>
    );
}

export { Logout };