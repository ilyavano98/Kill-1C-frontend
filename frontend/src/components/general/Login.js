
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../app/slices/auth";
import {useState} from "react";

export { Login };

function Login() {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { message } = useSelector((state) => state.message);
    const navigate = useNavigate(); // используем хук useNavigate для навигации по маршрутам
    const location = useLocation(); // используем хук useLocation для получения текущего маршрута
    const from = location.state?.from?.pathname || "/"; // получаем маршрут, на который нужно перенаправить пользователя после авторизации
    // form validation rules
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState,reset  } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    // Состояние для переключения форм
    const [isLoginForm, setIsLoginForm] = useState(true);

    function handleRegisterClick(e) {
        e.preventDefault();
        setIsLoginForm(false);
        reset(); // Очищаем форму входа при переключении
    }

    function handleLoginClick(e) {
        e.preventDefault();
        setIsLoginForm(true);
        // Здесь можно очистить форму регистрации
    }
    function onSubmit({ username, password }) {
        navigate(from, { replace: true }); // перенаправляем пользователя на страницу, которую он запрашивал до авторизации
        setLoading(true);
        dispatch(login({ username, password }))
            .unwrap()
            .then(() => {
                navigate(from, { replace: true });
                window.location.reload();
            })
            .catch(() => {
                setLoading(false);
            });

    }

    if (isLoggedIn) {
        return <Navigate to={from} />;
    }
    return (
        <>
            <div id="authContainer" className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">🦈</div>
                        <h2 className="auth-title">SharkTail</h2>
                        <p className="auth-subtitle">Система управления автомойками</p>
                    </div>

                    {/* Форма входа - показывается только когда isLoginForm = true */}
                    {isLoginForm ? (
                        <form id="loginForm" className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                            {errors.authError ? <div id="loginError" className="auth-error"></div> : ''}

                            <input type="text"
                                   id="loginUsername"
                                   className="form-control"
                                   placeholder="Логин"
                                   name="username"
                                   {...register('username')}
                                   autoComplete="username"/>

                            <input type="password"
                                   id="loginPassword"
                                   className="form-control"
                                   placeholder="Пароль"
                                   name="password"
                                   {...register('password')}
                                   autoComplete="current-password"/>

                            <button id="loginBtn" className="btn btn-primary" disabled={isSubmitting}>
                                <i className="bi bi-box-arrow-in-right"></i>
                                {isSubmitting ? 'Вход...' : 'Войти'}
                            </button>

                            <div className="auth-divider">
                                <span>Нет аккаунта?</span>
                            </div>

                            <button
                                id="showRegisterBtn"
                                className="btn btn-outline-primary"
                                onClick={handleRegisterClick}
                            >
                                <i className="bi bi-person-plus"></i> Зарегистрироваться
                            </button>
                        </form>
                    ) : (
                        // Форма регистрации - показывается когда isLoginForm = false
                        <form id="registerForm" className="auth-form">
                            <div id="registerError" className="auth-error"></div>
                            <div id="registerSuccess" className="auth-success"></div>

                            <input type="text"
                                   id="registerName"
                                   className="form-control"
                                   placeholder="Ваше имя"/>

                            <input type="text"
                                   id="registerUsername"
                                   className="form-control"
                                   placeholder="Логин"
                                   autoComplete="username"/>

                            <input type="password"
                                   id="registerPassword"
                                   className="form-control"
                                   placeholder="Пароль (минимум 6 символов)"
                                   autoComplete="new-password"/>

                            <input type="password"
                                   id="registerConfirmPassword"
                                   className="form-control"
                                   placeholder="Подтвердите пароль"
                                   autoComplete="new-password"/>

                            <button id="registerBtn" className="btn btn-primary">
                                <i className="bi bi-person-plus"></i> Зарегистрироваться
                            </button>

                            <div className="auth-divider">
                                <span>Уже есть аккаунт?</span>
                            </div>

                            <button
                                id="showLoginBtn"
                                className="btn btn-outline-primary"
                                onClick={handleLoginClick}
                            >
                                <i className="bi bi-box-arrow-in-right"></i> Войти
                            </button>
                        </form>
                    )}
                    <div className="auth-footer">
                        <p>SharkTail © 2026</p>
                    </div>
                </div>
            </div>
        </>
    );
}