import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { search } from '../api/api';

const Layout = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        search(query).then((data) => setSuggestions(data.slice(0, 6)));
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const getSectionTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Дашборд';
    if (path === '/clients') return 'Клиенты';
    if (path === '/cars') return 'Автомобили';
    if (path === '/services') return 'Услуги';
    if (path === '/employees') return 'Сотрудники';
    if (path === '/appointments') return 'Записи';
    if (path === '/shifts') return 'Смены';
    if (path === '/carwashes') return 'Мойки';
    if (path === '/washbays') return 'Моечные места';
    if (path === '/load-dashboard') return 'Загрузка моек';
    return 'MiniCRM';
  };

  const navItems = [
    { path: '/', icon: 'bi-speedometer2', label: 'Дашборд' },
    { path: '/clients', icon: 'bi-people', label: 'Клиенты' },
    { path: '/cars', icon: 'bi-car-front', label: 'Автомобили' },
    { path: '/services', icon: 'bi-tools', label: 'Услуги' },
    { path: '/employees', icon: 'bi-person-badge', label: 'Сотрудники' },
    { path: '/appointments', icon: 'bi-calendar-check', label: 'Записи' },
    { path: '/shifts', icon: 'bi-clock', label: 'Смены' },
    { path: '/carwashes', icon: 'bi-building', label: 'Мойки' },
    { path: '/washbays', icon: 'bi-geo-alt', label: 'Моечные места' },
    { path: '/load-dashboard', icon: 'bi-calendar-week', label: 'Загрузка моек' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">🧼</div>
          <div className="brand-name">MiniCRM</div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <i className={`bi ${item.icon}`}></i>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="create-btn" onClick={() => navigate('/appointments/new')}>
          <i className="bi bi-plus-lg"></i>
          <span className="btn-label">Создать</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="section-title">{getSectionTitle()}</div>
          <div className="search-wrapper">
            <div className="search-box">
              <i className="bi bi-search" style={{ color: 'var(--text-muted)' }}></i>
              <input
                ref={searchRef}
                type="text"
                placeholder="Поиск: имя, номер, услуга..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {suggestions.length > 0 && (
                <div className="search-suggestions">
                  {suggestions.map((item, idx) => (
                    <div key={idx} onClick={() => setQuery(item.text)}>
                      {item.type === 'client' && '👤 '}
                      {item.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="top-actions">
            <button className="btn btn-sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <i className="bi bi-sun"></i> : <i className="bi bi-moon"></i>}
            </button>
            <button className="btn btn-sm position-relative">
              <i className="bi bi-bell"></i>
            </button>
            <div className="user-avatar">
              <img src="https://i.pravatar.cc/40" alt="avatar" />
              <div className="muted">{user?.name || 'Администратор'}</div>
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;