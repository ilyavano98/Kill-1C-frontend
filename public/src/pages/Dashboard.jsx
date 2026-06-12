import React, { useState, useEffect } from 'react';
import {Row, Col, Card, Spinner} from 'react-bootstrap';
import {
    getClients,
    getDashboard,
    getDashboardCharts,
    getDashboardStats,
    getRecentAppointments,
    getServices
} from '../api/api';
import {DataTable} from "./components/DataTable";

// Функция для безопасного форматирования даты
const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    
    // Убираем часовой пояс с именем зоны (всё после + или [)
    let cleanDateStr = dateStr.split('+')[0].split('[')[0];
    
    const date = new Date(cleanDateStr);
    
    if (isNaN(date.getTime())) {
        console.warn('Не удалось распарсить дату:', dateStr);
        return dateStr;
    }
    
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusText = (status) => {
    const statusMap = {
        'pending': 'Ожидает',
        'confirmed': 'Подтверждена',
        'arrived': 'Приехал',
        'in_wash': 'На мойке',
        'completed': 'Завершена',
        'cancelled': 'Отменена'
    };
    return statusMap[status] || status || '—';
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
    // Лоадер и уведомления
    const [loading, setLoading] = useState(true);

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

    return (
        <>
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Загрузка данных...</p>
                </div>
            ) : (
                <Row className="mb-4">
                    <Col md={3}><Card><Card.Body><h6>Выручка сегодня</h6><h3>{stats.revenueToday} ₽</h3></Card.Body></Card></Col>
                    <Col md={3}><Card><Card.Body><h6>Выручка неделя</h6><h3>{stats.revenueWeek} ₽</h3></Card.Body></Card></Col>
                    <Col md={3}><Card><Card.Body><h6>Выручка месяц</h6><h3>{stats.revenueMonth} ₽</h3></Card.Body></Card></Col>
                    <Col md={3}><Card><Card.Body><h6>Клиенты / Авто</h6><h3>{stats.totalClients} / {stats.totalCars}</h3></Card.Body></Card></Col>
                </Row>
            )}

            <Card>
                <Card.Header>Последние записи</Card.Header>
                <Card.Body>
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
                            {recent.map(a => (
                                <tr key={a.id}>
                                    <td>{formatDateTime(a.dateTime)}</td>
                                    <td>{getClientName(a.clientId)}</td>
                                    <td>{getServiceName(a.serviceId)}</td>
                                    <td>{getStatusText(a.status)}</td>
                                    <td>{a.price || 0} ₽</td>
                                </tr>
                            ))}

                            {recent.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Нет данных
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Card.Body>
            </Card>
        </>
    );
};

export default Dashboard;