import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getAppointments, getClients, getCars, getServices, getEmployees, getWashBays, createAppointment, updateAppointment, deleteAppointment } from '../api/api';
import { formatDateTime, getDateObject} from '../functions/Functions'
import { DataTable } from "./components/DataTable";

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

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
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
        }
    };

    const save = async () => {
        try {
            const payload = { ...form, price: Number(form.price) };
            if (editing) {
                await updateAppointment(editing.id, payload);
            } else {
                await createAppointment(payload);
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
        }
    };

    const del = async (id) => {
        if (window.confirm('Удалить запись?')) {
            await deleteAppointment(id);
            await load();
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
        {
            key: 'dateTime',
            label: 'Время',
            filterType: 'date',
            format: formatDateTime
        },
        {
            key: 'clientId',
            label: 'Клиент',
            filterType: 'text',
            getDisplayValue: (item) => getClientName(item.clientId)
        },
        {
            key: 'carId',
            label: 'Авто',
            filterType: 'text',
            getDisplayValue: (item) => getCarPlate(item.carId)
        },
        {
            key: 'serviceId',
            label: 'Услуга',
            filterType: 'select',
            filterOptions: uniqueServices,
            getDisplayValue: (item) => getServiceName(item.serviceId)
        },
        {
            key: 'employeeId',
            label: 'Сотрудник',
            filterType: 'text',
            getDisplayValue: (item) => getEmployeeName(item.employeeId)
        },
        {
            key: 'status',
            label: 'Статус',
            filterType: 'select',
            filterOptions: ['Ожидает', 'Подтверждена', 'Приехал', 'На мойке', 'Завершена', 'Отменена'],
            getDisplayValue: (item) => getStatusText(item.status),
            format: (val) => <span className={`badge bg-${getStatusClass(val)}`}>{getStatusText(val)}</span>
        },
        {
            key: 'washBayId',
            label: 'Место',
            filterType: 'text',
            getDisplayValue: (item) => getBayName(item.washBayId)
        },
        {
            key: 'price',
            label: 'Цена',
            filterType: 'number',
            format: (val) => `${val || 0} ₽`
        }
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
            <DataTable
                data={items}
                columns={columns}
                idField="id"
                itemsPerPage={12}
                addButton={addButton}
                onEdit={openEdit}
                onDelete={del}
            />
            <Modal show={show} onHide={() => setShow(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Редактирование записи' : 'Новая запись'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control className="mb-2" type="datetime-local" value={form.dateTime} onChange={e => setForm({ ...form, dateTime: e.target.value })} />

                    <Form.Select className="mb-2" value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })}>
                        <option value="">Выберите клиента</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Form.Select>

                    <Form.Select className="mb-2" value={form.carId} onChange={e => setForm({ ...form, carId: e.target.value })}>
                        <option value="">Выберите авто</option>
                        {cars.filter(c => c.clientIds?.includes(Number(form.clientId))).map(c => <option key={c.id} value={c.id}>{c.plate}</option>)}
                    </Form.Select>

                    <Form.Select className="mb-2" value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value, price: services.find(s => s.id == e.target.value)?.price || '' })}>
                        <option value="">Выберите услугу</option>
                        {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.price} ₽)</option>)}
                    </Form.Select>

                    <Form.Select className="mb-2" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}>
                        <option value="">Выберите сотрудника</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </Form.Select>

                    <Form.Select className="mb-2" value={form.washBayId} onChange={e => setForm({ ...form, washBayId: e.target.value })}>
                        <option value="">Не выбрано</option>
                        {bays.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </Form.Select>

                    <Form.Select className="mb-2" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option value="pending">Ожидает</option>
                        <option value="confirmed">Подтверждена</option>
                        <option value="arrived">Приехал</option>
                        <option value="in_wash">На мойке</option>
                        <option value="completed">Завершена</option>
                        <option value="cancelled">Отменена</option>
                    </Form.Select>

                    <Form.Control className="mb-2" type="number" placeholder="Цена" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                    <Form.Control as="textarea" placeholder="Комментарий" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Отмена</Button>
                    <Button onClick={save}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Appointments;