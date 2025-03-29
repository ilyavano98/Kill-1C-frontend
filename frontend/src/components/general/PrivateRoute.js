import {Navigate, useLocation, Outlet} from 'react-router-dom';
import {useAuthState} from "../AuthProvider";

// Компонент PrivateRoute используется для защиты определенных маршрутов в приложении.
export function PrivateRoute() {
    const isAuthenticatedState = useAuthState(); // используем контекст для получения значения isAuthenticated
    const location = useLocation(); // получаем текущий маршрут с помощью хука useLocation()

    return (
        // если пользователь авторизован, то рендерим дочерние элементы текущего маршрута, используя компонент Outlet
        isAuthenticatedState.isAuth === true ? (
            <Outlet />
        ) : (
            // если пользователь не авторизован, то перенаправляем его на маршрут /login с помощью компонента Navigate
            // свойство replace указывает, что текущий маршрут будет заменен на новый, чтобы пользователь не мог вернуться обратно, используя кнопку "назад" в браузере.
            <Navigate to="/login" state={{ from: location }} replace />
        )
    );
}