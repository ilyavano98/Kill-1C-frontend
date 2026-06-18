import React, {useEffect, useState} from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { getAppointments, getClients, getCars, getServices, getEmployees, getWashBays, createAppointment, updateAppointment, deleteAppointment } from '../api/api';
import {formatDateTime, toDateTimeLocal} from '../functions/Functions';
import { DataTable } from "./components/DataTable";
import { AppointmentModal } from "../modals/AppointmentModal";
import TableEditor from '../components/TableEditor';
import { useCrud } from '../hooks/useCrud';

// Вспомогательные функции (без изменений)
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
    // --- Данные для формы ---
    const initialForm = {
        dateTime: '',
        clientId: '',
        carId: '',
        serviceId: '',
        employeeId: '',
        status: 'pending',
        price: '',
        comment: '',
        washBayId: ''
    };

    // --- Используем хук useCrud ---
    const {
        items,
        loading,
        form,
        setForm,
        show,
        setShow,
        editing,
        save,
        del,
        openEdit,
        openAdd,
    } = useCrud({
        getItems: getAppointments,
        createItem: createAppointment,
        updateItem: updateAppointment,
        deleteItem: deleteAppointment,
        initialForm,
        entityName: 'Запись',
        transformPayload: (data) => ({ ...data, price: Number(data.price) }),
        transformItemForEdit: (item) => ({...item, dateTime: toDateTimeLocal(item.dateTime) }),
    });

    // --- Дополнительные состояния для справочников ---
    const [clients, setClients] = useState([]);
    const [cars, setCars] = useState([]);
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [bays, setBays] = useState([]);

    // Загрузка справочников (можно вынести в отдельный хук, но для простоты оставим здесь)
    React.useEffect(() => {
        const loadDicts = async () => {
            try {
                const [clientsData, carsData, servicesData, employeesData, baysData] = await Promise.all([
                    getClients(), getCars(), getServices(), getEmployees(), getWashBays()
                ]);
                setClients(Array.isArray(clientsData) ? clientsData : clientsData?.data || []);
                setCars(Array.isArray(carsData) ? carsData : carsData?.data || []);
                setServices(Array.isArray(servicesData) ? servicesData : servicesData?.data || []);
                setEmployees(Array.isArray(employeesData) ? employeesData : employeesData?.data || []);
                setBays(Array.isArray(baysData) ? baysData : baysData?.data || []);
            } catch (e) {
                console.error('LOAD DICTS ERROR:', e);
            }
        };
        loadDicts();
    }, []);

    // ----- Функции получения имён по ID -----
    const getClientName = (id) => clients.find(c => c.id === id)?.name || id || '—';
    const getCarPlate = (id) => cars.find(c => c.id === id)?.plate || id || '—';
    const getServiceName = (id) => services.find(s => s.id === id)?.name || id || '—';
    const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || id || '—';
    const getBayName = (id) => bays.find(b => b.id === id)?.name || id || '—';

    // ----- Уникальные услуги для фильтра -----
    const uniqueServices = [...new Set(items.map(item => getServiceName(item.serviceId)))].filter(Boolean).sort();

    // ----- Базовое описание всех возможных колонок -----
    const allColumns = [
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

    const addButton = <Button onClick={openAdd}>+ Запись</Button>;

    return (
        <>
            <TableEditor tableName="appointments" allColumns={allColumns}>
                {({ visibleColumns }) => (
                    <>
                        {loading ? (
                            <div className="text-center my-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Загрузка данных...</p>
                            </div>
                        ) : (
                            <DataTable
                                data={items}
                                columns={visibleColumns}
                                idField="id"
                                itemsPerPage={12}
                                addButton={addButton}
                                onEdit={openEdit}
                                onDelete={del}
                            />
                        )}
                    </>
                )}
            </TableEditor>

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

export default Appointments;