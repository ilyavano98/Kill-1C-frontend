import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { getDashboardStats, getRecentAppointments } from '../api/api';

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
    const [recent, setRecent] = useState([]);

    useEffect(() => { loadDashboard(); }, []);

    const loadDashboard = async () => {
        try {
            const statsData = await getDashboardStats();
            const recentData = await getRecentAppointments();
            console.log("dashboardStats:", statsData);
            console.log("recentAppointments:", recentData);
            setStats(statsData);
            setRecent(Array.isArray(recentData) ? recentData : recentData?.data || []);
        } catch (e) {
            console.error("DASHBOARD ERROR:", e);
        }
    };

    return (
        <>
            <Row className="mb-4">
                <Col md={3}><Card><Card.Body><h6>Выручка сегодня</h6><h3>{stats.revenueToday} ₽</h3></Card.Body></Card></Col>
                <Col md={3}><Card><Card.Body><h6>Выручка неделя</h6><h3>{stats.revenueWeek} ₽</h3></Card.Body></Card></Col>
                <Col md={3}><Card><Card.Body><h6>Выручка месяц</h6><h3>{stats.revenueMonth} ₽</h3></Card.Body></Card></Col>
                <Col md={3}><Card><Card.Body><h6>Клиенты / Авто</h6><h3>{stats.totalClients} / {stats.totalCars}</h3></Card.Body></Card></Col>
            </Row>

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
            <td>{a.clientId || '—'}</td>
            <td>{a.serviceId || '—'}</td>
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