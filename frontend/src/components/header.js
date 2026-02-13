import React, { useState, useEffect } from "react";

export function Header() {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userName, setUserName] = useState("Администратор");
    const [userRole, setUserRole] = useState("Администратор");

    // Инициализация темы при загрузке компонента
    useEffect(() => {
        // Проверяем сохраненную тему в localStorage
        const savedTheme = localStorage.getItem('crm_theme_dark');
        const isDark = savedTheme === '1';

        setIsDarkTheme(isDark);

        // Применяем тему к body
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }

        // Загрузка уведомлений (пример)
        loadNotifications();

        // Загрузка данных пользователя (пример)
        loadUserData();
    }, []);

    // Функция загрузки уведомлений
    const loadNotifications = () => {
        // Здесь может быть запрос к API
        const count = 3; // Примерное количество
        setNotificationsCount(count);
    };

    // Функция загрузки данных пользователя
    const loadUserData = () => {
        // Здесь может быть запрос к API или получение из localStorage
        const name = localStorage.getItem('user_name') || "Администратор";
        const role = localStorage.getItem('user_role') || "Администратор";
        setUserName(name);
        setUserRole(role);
    };

    // Переключение темы
    const handleThemeToggle = () => {
        const newIsDark = !isDarkTheme;
        setIsDarkTheme(newIsDark);

        // Применяем/убираем класс на body
        if (newIsDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }

        // Сохраняем в localStorage
        localStorage.setItem('crm_theme_dark', newIsDark ? '1' : '0');
    };

    // Переключение меню пользователя
    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };

    // Выход из системы
    const handleLogout = () => {
        if (window.confirm('Вы уверены, что хотите выйти?')) {
            // Очистка данных авторизации
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_role');

            // Перенаправление на страницу входа
            window.location.href = '/login';
        }
    };

    // Обработчик поиска
    const handleSearch = (e) => {
        const query = e.target.value;
        // Здесь можно добавить логику поиска с debounce
        console.log('Поиск:', query);
    };

    return (
        <>
            <header className="topbar">
                <div className="section-title">Дашборд</div>

                <div className="search-wrap">
                    <div className="search" id="searchBox">
                        <i className="bi bi-search" style={{color: 'var(--text-muted)'}}></i>
                        <input
                            id="globalSearch"
                            placeholder="Поиск: имя, номер, услуга..."
                            autoComplete="off"
                            onChange={handleSearch}
                            onKeyPress={(e) => e.key === 'Enter' && console.log('Поиск по Enter')}
                        />
                        <div
                            id="searchSuggestions"
                            style={{
                                position: 'absolute',
                                marginTop: '44px',
                                width: '60%',
                                maxWidth: '720px',
                                zIndex: '50'
                            }}
                        ></div>
                    </div>
                </div>

                <div className="top-actions">
                    {/* Кнопка переключения темы */}
                    <button
                        className="btn btn-sm"
                        id="themeToggle"
                        title={isDarkTheme ? "Переключить на светлую тему" : "Переключить на темную тему"}
                        onClick={handleThemeToggle}
                    >
                        {isDarkTheme ? '☀️' : '🌙'}
                    </button>

                    {/* Кнопка уведомлений */}
                    <button
                        className="btn btn-sm position-relative"
                        id="notifBtn"
                        title="Уведомления"
                        onClick={() => console.log('Открыть уведомления')}
                    >
                        <i className="bi bi-bell" style={{color: 'var(--text)'}}></i>
                        {notificationsCount > 0 && (
                            <span
                                id="notifPing"
                                style={{
                                    position: 'absolute',
                                    right: '2px',
                                    top: '-2px',
                                    width: '8px',
                                    height: '8px',
                                    background: '#ef4444',
                                    borderRadius: '999px',
                                    display: 'block'
                                }}
                            ></span>
                        )}
                    </button>

                    {/* Информация о пользователе */}
                    <div
                        className="user-info"
                        id="userInfoBtn"
                        onClick={toggleUserMenu}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src="https://i.pravatar.cc/40"
                            className="rounded-circle"
                            alt="avatar"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40';
                            }}
                        />
                        <div>
                            <div id="userName">{userName}</div>
                            <div className="muted" id="userRole">{userRole}</div>
                        </div>
                        <i className={`bi bi-chevron-down ${userMenuOpen ? 'rotate-180' : ''}`}></i>
                    </div>

                    {/* Меню пользователя */}
                    {userMenuOpen && (
                        <div className="user-menu" id="userMenu">
                            <div className="user-menu-item">
                                <i className="bi bi-person"></i>
                                <span id="menuUserName">{userName}</span>
                            </div>
                            <div
                                className="user-menu-item"
                                onClick={() => {
                                    console.log('Открыть настройки');
                                    setUserMenuOpen(false);
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="bi bi-gear"></i>
                                <span>Настройки</span>
                            </div>
                            <div className="user-menu-divider"></div>
                            <div
                                className="user-menu-item"
                                id="logoutBtn"
                                onClick={handleLogout}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="bi bi-box-arrow-right"></i>
                                <span>Выйти</span>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}