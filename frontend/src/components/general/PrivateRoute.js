import {Navigate, useLocation, Outlet} from 'react-router-dom';
import {useSelector} from "react-redux";

// Компонент PrivateRoute используется для защиты определенных маршрутов в приложении.
export function PrivateRoute() {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const location = useLocation(); // получаем текущий маршрут с помощью хука useLocation()

    return (
        // если пользователь авторизован, то рендерим дочерние элементы текущего маршрута, используя компонент Outlet
        isLoggedIn ? (
            <Outlet />
        ) : (
            // если пользователь не авторизован, то перенаправляем его на маршрут /login с помощью компонента Navigate
            // свойство replace указывает, что текущий маршрут будет заменен на новый, чтобы пользователь не мог вернуться обратно, используя кнопку "назад" в браузере.
            <Navigate to="/login" state={{ from: location }} replace />
        )
    );
}