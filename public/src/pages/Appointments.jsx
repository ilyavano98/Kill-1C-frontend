import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getAppointments, getClients, getCars, getServices, getEmployees, getWashBays, createAppointment, updateAppointment, deleteAppointment } from '../api/api';

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

    // Пагинация
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Состояния для фильтра
    const [filterColumn, setFilterColumn] = useState('');
    const [filterValues, setFilterValues] = useState({});

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

            console.log("appointmentsData:", appointmentsData);

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

    // Функции для получения имён по ID
    const getClientName = (id) => {
        const client = clients.find(c => c.id === id);
        return client?.name || client?.username || id || '—';
    };

    const getCarPlate = (id) => {
        const car = cars.find(c => c.id === id);
        return car?.plate || id || '—';
    };

    const getServiceName = (id) => {
        const service = services.find(s => s.id === id);
        return service?.name || id || '—';
    };

    const getEmployeeName = (id) => {
        const emp = employees.find(e => e.id === id);
        return emp?.name || id || '—';
    };

    const getBayName = (id) => {
        const bay = bays.find(b => b.id === id);
        return bay?.name || id || '—';
    };

    // Функция фильтрации
    const getFilteredItems = () => {
        if (!filterColumn || !filterValues[filterColumn]) return items;

        return items.filter(item => {
            switch (filterColumn) {
                case 'dateTime': {
                    const { from, to } = filterValues.dateTime || {};
                    if (!from && !to) return true;
                    const itemDate = new Date(item.dateTime);
                    if (from && itemDate < new Date(from)) return false;
                    if (to && itemDate > new Date(to)) return false;
                    return true;
                }
                case 'clientId': {
                    const search = filterValues.clientId?.toLowerCase() || '';
                    if (!search) return true;
                    const clientName = getClientName(item.clientId).toLowerCase();
                    return clientName.includes(search);
                }
                case 'carId': {
                    const search = filterValues.carId?.toLowerCase() || '';
                    if (!search) return true;
                    const carPlate = getCarPlate(item.carId).toLowerCase();
                    return carPlate.includes(search);
                }
                case 'serviceId': {
                    const selectedService = filterValues.serviceId;
                    if (!selectedService) return true;
                    const serviceName = getServiceName(item.serviceId);
                    return serviceName === selectedService;
                }
                case 'employeeId': {
                    const search = filterValues.employeeId?.toLowerCase() || '';
                    if (!search) return true;
                    const employeeName = getEmployeeName(item.employeeId).toLowerCase();
                    return employeeName.includes(search);
                }
                case 'status': {
                    const selectedStatus = filterValues.status;
                    if (!selectedStatus) return true;
                    const statusText = getStatusText(item.status);
                    return statusText === selectedStatus;
                }
                case 'washBayId': {
                    const search = filterValues.washBayId?.toLowerCase() || '';
                    if (!search) return true;
                    const bayName = getBayName(item.washBayId).toLowerCase();
                    return bayName.includes(search);
                }
                case 'price': {
                    const { min, max } = filterValues.price || {};
                    const price = Number(item.price);
                    if (min && price < Number(min)) return false;
                    if (max && price > Number(max)) return false;
                    return true;
                }
                default:
                    return true;
            }
        });
    };

    const filteredItems = getFilteredItems();

    // Пагинация уже по отфильтрованным данным
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPage = (page) => {
        let pageNumber = Number(page);
        if (isNaN(pageNumber)) pageNumber = 1;
        pageNumber = Math.min(Math.max(1, pageNumber), totalPages);
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filterColumn, filterValues, items.length]);

    // Получить уникальные названия услуг для выпадающего списка
    const uniqueServices = [...new Set(items.map(item => getServiceName(item.serviceId)))].filter(Boolean).sort();

    // Сброс фильтра
    const resetFilter = () => {
        setFilterColumn('');
        setFilterValues({});
    };

    // Обработчик изменения полей фильтра
    const handleFilterChange = (value) => {
        setFilterValues(prev => ({ ...prev, [filterColumn]: value }));
    };

    // Рендер полей фильтра в зависимости от выбранной колонки
    const renderFilterInputs = () => {
        if (!filterColumn) return null;

        switch (filterColumn) {
            case 'dateTime':
                return (
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="datetime-local"
                            placeholder="От"
                            value={filterValues.dateTime?.from || ''}
                            onChange={e => handleFilterChange({ ...filterValues.dateTime, from: e.target.value })}
                        />
                        <Form.Control
                            type="datetime-local"
                            placeholder="До"
                            value={filterValues.dateTime?.to || ''}
                            onChange={e => handleFilterChange({ ...filterValues.dateTime, to: e.target.value })}
                        />
                    </div>
                );
            case 'clientId':
                return (
                    <Form.Control
                        type="text"
                        placeholder="Введите имя клиента..."
                        value={filterValues.clientId || ''}
                        onChange={e => handleFilterChange(e.target.value)}
                    />
                );
            case 'carId':
                return (
                    <Form.Control
                        type="text"
                        placeholder="Введите госномер..."
                        value={filterValues.carId || ''}
                        onChange={e => handleFilterChange(e.target.value)}
                    />
                );
            case 'serviceId':
                return (
                    <Form.Select
                        value={filterValues.serviceId || ''}
                        onChange={e => handleFilterChange(e.target.value)}
                    >
                        <option value="">Все услуги</option>
                        {uniqueServices.map(service => (
                            <option key={service} value={service}>{service}</option>
                        ))}
                    </Form.Select>
                );
            case 'employeeId':
                return (
                    <Form.Control
                        type="text"
                        placeholder="Введите имя сотрудника..."
                        value={filterValues.employeeId || ''}
                        onChange={e => handleFilterChange(e.target.value)}
                    />
                );
            case 'status':
                return (
                    <Form.Select
                        value={filterValues.status || ''}
                        onChange={e => handleFilterChange(e.target.value)}
                    >
                        <option value="">Все статусы</option>
                        <option value="Ожидает">Ожидает</option>
                        <option value="Подтверждена">Подтверждена</option>
                        <option value="Приехал">Приехал</option>
                        <option value="На мойке">На мойке</option>
                        <option value="Завершена">Завершена</option>
                        <option value="Отменена">Отменена</option>
                    </Form.Select>
                );
            case 'washBayId':
                return (
                    <Form.Control
                        type="text"
                        placeholder="Введите название места..."
                        value={filterValues.washBayId || ''}
                        onChange={e => handleFilterChange(e.target.value)}
                    />
                );
            case 'price':
                return (
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="number"
                            placeholder="Цена от"
                            value={filterValues.price?.min || ''}
                            onChange={e => handleFilterChange({ ...filterValues.price, min: e.target.value })}
                        />
                        <Form.Control
                            type="number"
                            placeholder="Цена до"
                            value={filterValues.price?.max || ''}
                            onChange={e => handleFilterChange({ ...filterValues.price, max: e.target.value })}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                <Button onClick={() => { setEditing(null); setForm({
                    dateTime: '', clientId: '', carId: '', serviceId: '', employeeId: '',
                    status: 'pending', price: '', comment: '', washBayId: ''
                }); setShow(true); }}>
                    + Запись
                </Button>

                <div style={{ minWidth: '200px' }}>
                    <Form.Select value={filterColumn} onChange={e => setFilterColumn(e.target.value)}>
                        <option value="">Фильтровать по...</option>
                        <option value="dateTime">Время</option>
                        <option value="clientId">Клиент</option>
                        <option value="carId">Авто</option>
                        <option value="serviceId">Услуга</option>
                        <option value="employeeId">Сотрудник</option>
                        <option value="status">Статус</option>
                        <option value="washBayId">Место</option>
                        <option value="price">Цена</option>
                    </Form.Select>
                </div>

                {filterColumn && (
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        {renderFilterInputs()}
                    </div>
                )}

                {filterColumn && (
                    <Button variant="outline-secondary" onClick={resetFilter}>
                        Сбросить фильтр
                    </Button>
                )}
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Время</th>
                        <th>Клиент</th>
                        <th>Авто</th>
                        <th>Услуга</th>
                        <th>Сотрудник</th>
                        <th>Статус</th>
                        <th>Место</th>
                        <th>Цена</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(a => (
                        <tr key={a.id}>
                            <td>{formatDateTime(a.dateTime)}</td>
                            <td>{getClientName(a.clientId)}</td>
                            <td>{getCarPlate(a.carId)}</td>
                            <td>{getServiceName(a.serviceId)}</td>
                            <td>{getEmployeeName(a.employeeId)}</td>
                            <td><span className={`badge bg-${getStatusClass(a.status)}`}>{getStatusText(a.status)}</span></td>
                            <td>{getBayName(a.washBayId)}</td>
                            <td>{a.price || 0} ₽</td>
                            <td>
                                <Button size="sm" variant="warning" onClick={() => openEdit(a)}>✏️</Button>
                                <Button size="sm" variant="danger" onClick={() => del(a.id)}>🗑️</Button>
                            </td>
                        </tr>
                    ))}
                    {filteredItems.length === 0 && (
                        <tr>
                            <td colSpan="9" className="text-center">Нет данных</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {filteredItems.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        Показано {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredItems.length)} из {filteredItems.length} записей
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="outline-secondary" onClick={goToPrevPage} disabled={currentPage === 1}>
                            ← Назад
                        </Button>
                        <span className="align-self-center">Страница {currentPage} из {totalPages}</span>
                        <Button variant="outline-secondary" onClick={goToNextPage} disabled={currentPage === totalPages}>
                            Вперед →
                        </Button>
                        <Form.Control
                            type="number"
                            min={1}
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => goToPage(e.target.value)}
                            style={{ width: '70px' }}
                            className="text-center"
                        />
                    </div>
                </div>
            )}

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