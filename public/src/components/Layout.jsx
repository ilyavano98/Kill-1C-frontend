import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  createAppointment,
  getCars,
  getClients,
  getEmployees,
  getServices,
  getWashBays,
  search,
} from '../api/api';
import { AppointmentModal } from '../modals/AppointmentModal';
import { Alert } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import { useMediaQuery } from '../hooks/useMediaQuery';
import HamburgerIcon from '../components/icons/HamburgerIcon';
import SearchIcon from '../components/icons/SearchIcon';
import CloseIcon from '../components/icons/CloseIcon';

const Layout = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef();
  const searchInputRef = useRef();

  const isMobile = useMediaQuery('(max-width: 768px)');

  // Закрываем меню при переходе на десктоп
  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
      setSearchOpen(false);
    }
  }, [isMobile]);

  // Состояния для справочников
  const [clients, setClients] = useState([]);
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [bays, setBays] = useState([]);

  // Состояния для модального окна записи
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    dateTime: '',
    clientId: '',
    carId: '',
    serviceId: '',
    employeeId: '',
    status: 'pending',
    price: '',
    comment: '',
    washBayId: '',
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

  // Загрузка данных
  const load = async () => {
    try {
      const [clientsData, carsData, servicesData, employeesData, baysData] = await Promise.all([
        getClients(),
        getCars(),
        getServices(),
        getEmployees(),
        getWashBays(),
      ]);
      setClients(Array.isArray(clientsData) ? clientsData : clientsData?.data || []);
      setCars(Array.isArray(carsData) ? carsData : carsData?.data || []);
      setServices(Array.isArray(servicesData) ? servicesData : servicesData?.data || []);
      setEmployees(Array.isArray(employeesData) ? employeesData : employeesData?.data || []);
      setBays(Array.isArray(baysData) ? baysData : baysData?.data || []);
    } catch (e) {
      console.error('LOAD ERROR:', e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Тёмная тема
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Блокировка скролла при открытом меню
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  // Автофокус на поиск при открытии
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [searchOpen]);

  // Поиск с задержкой
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        search(query).then((data) => setSuggestions(data.slice(0, 6)));
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  // Уведомления
  const showNotification = (message, variant = 'success') => {
    setNotification({ show: true, message, variant });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
  };

  // Сохранение записи
  const save = async () => {
    try {
      const payload = { ...form, price: Number(form.price) };
      await createAppointment(payload);
      showNotification('Запись успешно создана', 'success');
      setShow(false);
      setEditing(null);
      setForm({
        dateTime: '',
        clientId: '',
        carId: '',
        serviceId: '',
        employeeId: '',
        status: 'pending',
        price: '',
        comment: '',
        washBayId: '',
      });
      await load();
    } catch (e) {
      console.error('SAVE ERROR:', e);
      showNotification('Ошибка при сохранении записи', 'danger');
    }
  };

  // Заголовок страницы
  const getSectionTitle = () => {
    const path = location.pathname;
    const map = {
      '/': 'Дашборд',
      '/clients': 'Клиенты',
      '/cars': 'Автомобили',
      '/services': 'Услуги',
      '/employees': 'Сотрудники',
      '/appointments': 'Записи',
      '/shifts': 'Смены',
      '/carwashes': 'Мойки',
      '/washbays': 'Моечные места',
      '/load-dashboard': 'Загрузка моек',
    };
    return map[path] || 'MiniCRM';
  };

  // Пункты меню
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

  // Выход
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Открыть модалку создания записи
  const handleCreateClick = () => {
    setEditing(null);
    setForm({
      dateTime: '',
      clientId: '',
      carId: '',
      serviceId: '',
      employeeId: '',
      status: 'pending',
      price: '',
      comment: '',
      washBayId: '',
    });
    setShow(true);
    setMenuOpen(false);
  };

  return (
      <>
        {notification.show && (
            <div
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  zIndex: 9999,
                  minWidth: '250px',
                }}
            >
              <Alert
                  variant={notification.variant}
                  onClose={() => setNotification({ ...notification, show: false })}
                  dismissible
              >
                {notification.message}
              </Alert>
            </div>
        )}

        <div className="app-layout">
          <Sidebar
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              navItems={navItems}
              onCreateClick={handleCreateClick}
              isMobile={isMobile}
          />

          <main className="main-content">
            <header className="topbar">
              <div className="left-section">
                {isMobile && (
                    <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                      <HamburgerIcon width={28} height={28} color="currentColor" />
                    </button>
                )}
                <div className="section-title">{getSectionTitle()}</div>
              </div>

              {/* Поиск на десктопе — всегда виден */}
              {!isMobile && (
                  <div className="search-wrapper">
                    <div className="search-box">
                      <SearchIcon width={18} height={18} color="var(--text-muted, #6c757d)" />
                      <input
                          ref={searchRef}
                          type="text"
                          placeholder="Поиск..."
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
              )}

              <div className="top-actions">
                {/* Кнопка поиска для мобилок */}
                {isMobile && (
                    <button
                        className="btn btn-sm search-toggle"
                        onClick={() => setSearchOpen(!searchOpen)}
                    >
                      <SearchIcon width={20} height={20} color="currentColor" />
                    </button>
                )}
                <button className="btn btn-sm" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? '☀️' : '🌙'}
                </button>
                <button className="btn btn-sm position-relative">
                  <span role="img" aria-label="уведомления">🔔</span>
                </button>
                <div className="user-avatar d-none d-md-flex">
                  <img src="https://i.pravatar.cc/40" alt="avatar" />
                  <div className="muted">{user?.name || 'Администратор'}</div>
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </div>
            </header>

            {/* Мобильный поиск (раскрывается сверху) */}
            {isMobile && searchOpen && (
                <div className="mobile-search">
                  <div className="mobile-search-box">
                    <SearchIcon width={18} height={18} color="var(--text-muted, #6c757d)" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Поиск..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="mobile-search-close" onClick={() => setSearchOpen(false)}>
                      <CloseIcon width={20} height={20} color="currentColor" />
                    </button>
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
            )}

            <section className="content">
              <Outlet />
            </section>
          </main>
        </div>

        <AppointmentModal
            show={show}
            onHide={() => setShow(false)}
            editing={editing}
            form={form}
            setForm={setForm}
            clients={clients}
            cars={cars}
            services={services}
            employees={employees}
            bays={bays}
            onSave={save}
            loading={loading}
        />
      </>
  );
};

export default Layout;