import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Button, Form } from 'react-bootstrap';
import {
    getClients,
    getDashboardStats,
    getRecentAppointments,
    getServices
} from '../api/api';

// Вспомогательные функции
const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    let cleanDateStr = dateStr.split('+')[0].split('[')[0];
    const date = new Date(cleanDateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusText = (status) => {
    const map = {
        'pending': 'Ожидает',
        'confirmed': 'Подтверждена',
        'arrived': 'Приехал',
        'in_wash': 'На мойке',
        'completed': 'Завершена',
        'cancelled': 'Отменена'
    };
    return map[status] || status || '—';
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        revenueToday: 0, revenueWeek: 0, revenueMonth: 0,
        completedToday: 0, activeWeek: 0,
        totalAppointments: 0, totalClients: 0, totalCars: 0
    });
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    // Пагинация для таблицы последних записей
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // показываем по 5 записей

    useEffect(() => { loadDashboard(); }, []);

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const statsResponse = await getDashboardStats();
            const recentResponse = await getRecentAppointments();
            const clientsData = await getClients();
            const servicesData = await getServices();

            setStats(Array.isArray(statsResponse) ? statsResponse : statsResponse?.data || []);
            setRecent(Array.isArray(recentResponse) ? recentResponse : recentResponse?.data || []);
            setClients(Array.isArray(clientsData) ? clientsData : clientsData?.data || []);
            setServices(Array.isArray(servicesData) ? servicesData : servicesData?.data || []);
        } catch (e) {
            console.error("DASHBOARD ERROR:", e);
        } finally {
            setLoading(false);
        }
    };

    const getClientName = (id) => clients.find(c => c.id === id)?.name || id || '—';
    const getServiceName = (id) => services.find(s => s.id === id)?.name || id || '—';

    // Пагинация: вычисляем текущие записи
    const totalPages = Math.ceil(recent.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRecent = recent.slice(startIndex, startIndex + itemsPerPage);

    const goToPrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const goToNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
    const goToPage = (page) => {
        let p = Number(page);
        if (isNaN(p)) p = 1;
        setCurrentPage(Math.min(Math.max(1, p), totalPages));
    };

    return (
        <>
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Загрузка данных...</p>
                </div>
            ) : (
                <>
                    {/* Карточки статистики */}
                    <Row className="dashboard-stats mb-4">
                        <Col md={3} sm={6} xs={6} className="mb-3">
                            <Card className="stat-card">
                                <Card.Body>
                                    <h6 className="stat-label">Выручка сегодня</h6>
                                    <h3 className="stat-value">{stats.revenueToday} ₽</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} xs={6} className="mb-3">
                            <Card className="stat-card">
                                <Card.Body>
                                    <h6 className="stat-label">Выручка неделя</h6>
                                    <h3 className="stat-value">{stats.revenueWeek} ₽</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} xs={6} className="mb-3">
                            <Card className="stat-card">
                                <Card.Body>
                                    <h6 className="stat-label">Выручка месяц</h6>
                                    <h3 className="stat-value">{stats.revenueMonth} ₽</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} xs={6} className="mb-3">
                            <Card className="stat-card">
                                <Card.Body>
                                    <h6 className="stat-label">Клиенты / Авто</h6>
                                    <h3 className="stat-value">{stats.totalClients} / {stats.totalCars}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Последние записи с пагинацией */}
                    <div className="dashboard-recent">
                        <h3 className="dashboard-recent-title">Последние записи</h3>
                        <div className="dashboard-recent-table">
                            <table className="table table-sm">
                                <thead>
                                <tr>
                                    <th>Время</th>
                                    <th>Клиент</th>
                                    <th>Услуга</th>
                                    <th>Статус</th>
                                    <th>Сумма</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentRecent.map(a => (
                                    <tr key={a.id}>
                                        <td>{formatDateTime(a.dateTime)}</td>
                                        <td>{getClientName(a.clientId)}</td>
                                        <td>{getServiceName(a.serviceId)}</td>
                                        <td>
                                                <span className={`badge bg-${a.status === 'pending' ? 'secondary' : a.status === 'confirmed' ? 'primary' : a.status === 'arrived' ? 'warning' : a.status === 'in_wash' ? 'info' : a.status === 'completed' ? 'success' : 'danger'}`}>
                                                    {getStatusText(a.status)}
                                                </span>
                                        </td>
                                        <td>{a.price || 0} ₽</td>
                                    </tr>
                                ))}
                                {currentRecent.length === 0 && (
                                    <tr><td colSpan="5" className="text-center">Нет данных</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Пагинация (только если записей больше itemsPerPage) */}
                        {recent.length > itemsPerPage && (
                            <div className="pagination-wrapper">
                                <div className="pagination-info">
                                    Показано {startIndex + 1}–{Math.min(startIndex + itemsPerPage, recent.length)} из {recent.length} записей
                                </div>
                                <div className="pagination-controls">
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={goToPrevPage}
                                        disabled={currentPage === 1}
                                        className="pagination-btn"
                                    >
                                        <span className="d-none d-sm-inline">Назад</span>
                                        <span className="d-inline d-sm-none">←</span>
                                    </Button>
                                    <span className="pagination-page">
                                        Страница {currentPage} из {totalPages}
                                    </span>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className="pagination-btn"
                                    >
                                        <span className="d-none d-sm-inline">Вперед</span>
                                        <span className="d-inline d-sm-none">→</span>
                                    </Button>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        max={totalPages}
                                        value={currentPage}
                                        onChange={e => goToPage(e.target.value)}
                                        className="pagination-input"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default Dashboard;