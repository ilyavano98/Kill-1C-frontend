import React, { useState, useEffect } from 'react';

// Предполагаем, что есть storage контекст или пропс
const AppointmentTable = ({ storage, onEditAppt, onDeleteAppt, onStatusChange }) => {
    // Состояния для фильтров
    const [filters, setFilters] = useState({
        status: '',
        carWash: '',
        dateFrom: '',
        dateTo: ''
    });

    // Состояние для отфильтрованных записей
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [carWashes, setCarWashes] = useState([]);

    // Маппинг статусов
    const statusMap = {
        'pending': {
            color: '#94a3b8',
            text: 'Ожидает подтверждения',
            shortText: 'Ожидает'
        },
        'confirmed': {
            color: '#3b82f6',
            text: 'Подтверждена',
            shortText: 'Подтверждена'
        },
        'arrived': {
            color: '#f59e0b',
            text: 'Клиент приехал',
            shortText: 'Приехал'
        },
        'in_wash': {
            color: '#7c3aed',
            text: 'На мойке',
            shortText: 'На мойке'
        },
        'completed': {
            color: '#10b981',
            text: 'Завершена',
            shortText: 'Завершена'
        },
        'cancelled': {
            color: '#ef4444',
            text: 'Отменена',
            shortText: 'Отменена'
        }
    };

    // Инициализация данных (аналог DOMContentLoaded)
    useEffect(() => {
        if (storage && storage.washBays) {
            setCarWashes(storage.washBays);
        }
        applyFilters();
    }, [storage]);

    // Применение фильтров при их изменении
    useEffect(() => {
        applyFilters();
    }, [filters, storage?.appointments]);

    // Функция форматирования даты
    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return '—';
        const date = new Date(dateTimeStr);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Функция применения фильтров
    const applyFilters = () => {
        if (!storage?.appointments) return;

        let filtered = [...storage.appointments];

        // Фильтр по статусу
        if (filters.status) {
            filtered = filtered.filter(appt => appt.status === filters.status);
        }

        // Фильтр по мойке
        if (filters.carWash) {
            filtered = filtered.filter(appt => appt.washBayId === parseInt(filters.carWash));
        }

        // Фильтр по дате с
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filtered = filtered.filter(appt => new Date(appt.dateTime) >= fromDate);
        }

        // Фильтр по дате по
        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999); // Устанавливаем конец дня
            filtered = filtered.filter(appt => new Date(appt.dateTime) <= toDate);
        }

        // Сортировка по дате (новые сверху)
        filtered.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

        setFilteredAppointments(filtered);
    };

    // Обработчик изменения фильтров
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Быстрое изменение статуса
    const handleQuickStatusChange = (appointmentId) => {
        if (onStatusChange) {
            onStatusChange(appointmentId);
        }
    };

    // Получение связанных данных
    const getRelatedData = (appointment) => {
        const client = storage?.clients?.find(c => c.id === appointment.clientId) || {};
        const car = storage?.cars?.find(c => c.id === appointment.carId) || {};
        const service = storage?.services?.find(s => s.id === appointment.serviceId) || {};
        const employee = storage?.employees?.find(e => e.id === appointment.employeeId) || {};
        const washBay = storage?.washBays?.find(b => b.id === appointment.washBayId) || {};

        return { client, car, service, employee, washBay };
    };

    return (
        <>
            {/* Фильтры */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        {/* Фильтр по статусу */}
                        <div className="col-md-3">
                            <label className="form-label">Статус</label>
                            <select
                                id="filterStatus"
                                className="form-select"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">Все статусы</option>
                                {Object.entries(statusMap).map(([key, value]) => (
                                    <option key={key} value={key}>{value.text}</option>
                                ))}
                            </select>
                        </div>

                        {/* Фильтр по мойке */}
                        <div className="col-md-3">
                            <label className="form-label">Мойка</label>
                            <select
                                id="filterCarWash"
                                className="form-select"
                                value={filters.carWash}
                                onChange={(e) => handleFilterChange('carWash', e.target.value)}
                            >
                                <option value="">Все мойки</option>
                                {carWashes.map(washBay => (
                                    <option key={washBay.id} value={washBay.id}>
                                        {washBay.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Фильтр по дате с */}
                        <div className="col-md-3">
                            <label className="form-label">Дата с</label>
                            <input
                                id="filterDateFrom"
                                type="date"
                                className="form-control"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                            />
                        </div>

                        {/* Фильтр по дате по */}
                        <div className="col-md-3">
                            <label className="form-label">Дата по</label>
                            <input
                                id="filterDateTo"
                                type="date"
                                className="form-control"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Таблица */}
            <div className="card">
                <table className="table compact-table">
                    <thead>
                    <tr>
                        <th>Дата и время</th>
                        <th>Клиент</th>
                        <th>Автомобиль</th>
                        <th>Услуга</th>
                        <th>Сотрудник</th>
                        <th>Статус</th>
                        <th>Бокс</th>
                        <th>Стоимость</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody id="appointmentsTbody">
                    {filteredAppointments.map(appointment => {
                        const { client, car, service, employee, washBay } = getRelatedData(appointment);
                        const statusInfo = statusMap[appointment.status] || statusMap.pending;

                        return (
                            <tr key={appointment.id}>
                                <td>{formatDateTime(appointment.dateTime)}</td>
                                <td>{client.name || '—'}</td>
                                <td>{car.plate || '—'}</td>
                                <td>{service.name || '—'}</td>
                                <td>{employee.name || '—'}</td>
                                <td>
                    <span
                        className="badge-status"
                        style={{
                            background: statusInfo.color,
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875em'
                        }}
                        onChange={() => handleQuickStatusChange(appointment.id)}
                        title={`Кликните для изменения статуса`}
                    >
                      {statusInfo.shortText}
                    </span>
                                </td>
                                <td>{washBay.name || '—'}</td>
                                <td>{appointment.price || 0} ₽</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary me-1"
                                        onClick={() => onEditAppt && onEditAppt(appointment.id)}
                                        title="Редактировать"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => onDeleteAppt && onDeleteAppt(appointment.id)}
                                        title="Удалить"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}

                    {filteredAppointments.length === 0 && (
                        <tr>
                            <td colSpan="9" className="text-center text-muted py-4">
                                Записи не найдены
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AppointmentTable;