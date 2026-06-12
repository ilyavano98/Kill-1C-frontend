import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { getAppointments, getClients, getCars, getServices, getEmployees, getWashBays, createAppointment, updateAppointment, deleteAppointment } from '../api/api';
import { formatDateTime, getDateObject } from '../functions/Functions';
import { DataTable } from "./components/DataTable";
import { AppointmentModal } from "../modals/AppointmentModal";

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

const getStatusClass = (status) => {
    const map = {
        'pending': 'secondary',
        'confirmed': 'primary',
        'arrived': 'warning',
        'in_wash': 'info',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return map[status] || 'secondary';
};

const Appointments = () => {
    const [items, setItems] = useState([]);
    const [clients, setClients] = useState([]);
    const [cars, setCars] = useState([]);
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [bays, setBays] = useState([]);
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
        washBayId: ''
    });

    // Лоадер и уведомления
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

    useEffect(() => {
        load();
    }, []);

    const showNotification = (message, variant = 'success') => {
        setNotification({ show: true, message, variant });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    const load = async () => {
        setLoading(true);
        try {
            const appointmentsData = await getAppointments({});
            const clientsData = await getClients();
            const carsData = await getCars();
            const servicesData = await getServices();
            const employeesData = await getEmployees();
            const baysData = await getWashBays();

            setItems(Array.isArray(appointmentsData) ? appointmentsData : appointmentsData?.data || []);
            setClients(Array.isArray(clientsData) ? clientsData : clientsData?.data || []);
            setCars(Array.isArray(carsData) ? carsData : carsData?.data || []);
            setServices(Array.isArray(servicesData) ? servicesData : servicesData?.data || []);
            setEmployees(Array.isArray(employeesData) ? employeesData : employeesData?.data || []);
            setBays(Array.isArray(baysData) ? baysData : baysData?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
            showNotification('Ошибка загрузки данных', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const save = async () => {
        setLoading(true);
        try {
            const payload = { ...form, price: Number(form.price) };
            if (editing) {
                await updateAppointment(editing.id, payload);
                showNotification('Запись успешно обновлена', 'success');
            } else {
                await createAppointment(payload);
                showNotification('Запись успешно добавлена', 'success');
            }
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
                washBayId: ''
            });
            await load();
        } catch (e) {
            console.error("SAVE ERROR:", e);
            showNotification('Ошибка при сохранении записи', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const del = async (id) => {
        if (!window.confirm('Удалить запись?')) return;
        setLoading(true);
        try {
            await deleteAppointment(id);
            showNotification('Запись удалена', 'success');
            await load();
        } catch (e) {
            console.error("DELETE ERROR:", e);
            showNotification('Ошибка при удалении записи', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            dateTime: item.dateTime || '',
            clientId: item.clientId || '',
            carId: item.carId || '',
            serviceId: item.serviceId || '',
            employeeId: item.employeeId || '',
            status: item.status || 'pending',
            price: item.price || '',
            comment: item.comment || '',
            washBayId: item.washBayId || ''
        });
        setShow(true);
    };

    // Функции получения имён по ID
    const getClientName = (id) => clients.find(c => c.id === id)?.name || id || '—';
    const getCarPlate = (id) => cars.find(c => c.id === id)?.plate || id || '—';
    const getServiceName = (id) => services.find(s => s.id === id)?.name || id || '—';
    const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || id || '—';
    const getBayName = (id) => bays.find(b => b.id === id)?.name || id || '—';

    // Получить уникальные названия услуг для выпадающего списка
    const uniqueServices = [...new Set(items.map(item => getServiceName(item.serviceId)))].filter(Boolean).sort();

    // Конфигурация колонок для DataTable
    const columns = [
        { key: 'dateTime', label: 'Время', filterType: 'date', format: formatDateTime },
        { key: 'clientId', label: 'Клиент', filterType: 'text', getDisplayValue: (item) => getClientName(item.clientId) },
        { key: 'carId', label: 'Авто', filterType: 'text', getDisplayValue: (item) => getCarPlate(item.carId) },
        { key: 'serviceId', label: 'Услуга', filterType: 'select', filterOptions: uniqueServices, getDisplayValue: (item) => getServiceName(item.serviceId) },
        { key: 'employeeId', label: 'Сотрудник', filterType: 'text', getDisplayValue: (item) => getEmployeeName(item.employeeId) },
        {
            key: 'status', label: 'Статус', filterType: 'select',
            filterOptions: ['Ожидает', 'Подтверждена', 'Приехал', 'На мойке', 'Завершена', 'Отменена'],
            getDisplayValue: (item) => getStatusText(item.status),
            format: (val) => <span className={`badge bg-${getStatusClass(val)}`}>{getStatusText(val)}</span>
        },
        { key: 'washBayId', label: 'Место', filterType: 'text', getDisplayValue: (item) => getBayName(item.washBayId) },
        { key: 'price', label: 'Цена', filterType: 'number', format: (val) => `${val || 0} ₽` }
    ];

    const addButton = (
        <Button onClick={() => {
            setEditing(null);
            setForm({
                dateTime: '', clientId: '', carId: '', serviceId: '', employeeId: '',
                status: 'pending', price: '', comment: '', washBayId: ''
            });
            setShow(true);
        }}>
            + Запись
        </Button>
    );

    return (
        <>
            {/* Уведомления */}
            {notification.show && (
                <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, minWidth: '250px' }}>
                    <Alert variant={notification.variant} onClose={() => setNotification({ ...notification, show: false })} dismissible>
                        {notification.message}
                    </Alert>
                </div>
            )}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Загрузка данных...</p>
                </div>
            ) : (
                <DataTable
                    data={items}
                    columns={columns}
                    idField="id"
                    itemsPerPage={12}
                    addButton={addButton}
                    onEdit={openEdit}
                    onDelete={del}
                />
            )}

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
                loading={loading} // можно также заблокировать кнопки в модалке во время сохранения
            />
        </>
    );
};

export default Appointments;