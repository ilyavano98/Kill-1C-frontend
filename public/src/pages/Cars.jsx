import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getCars, getClients, createCar, updateCar, deleteCar } from '../api/api';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [clients, setClients] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);

    const [form, setForm] = useState({
        clientIds: [],
        plate: '',
        brand: '',
        model: '',
        year: '',
        bodyType: 'седан'
    });

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const carsData = await getCars();
            const clientsData = await getClients();

            console.log("carsData:", carsData);
            console.log("clientsData:", clientsData);

            // FIX №1 — правильное извлечение данных
            setCars(Array.isArray(carsData) ? carsData : carsData?.data || []);
            setClients(Array.isArray(clientsData) ? clientsData : clientsData?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
        }
    };

    const save = async () => {
        const payload = {
            ...form,
            year: Number(form.year)
        };

        if (editing) {
            await updateCar(editing.id, payload);
        } else {
            await createCar(payload);
        }

        setShow(false);
        setEditing(null);
        setForm({
            clientIds: [],
            plate: '',
            brand: '',
            model: '',
            year: '',
            bodyType: 'седан'
        });

        load();
    };

    const del = async (id) => {
        if (window.confirm('Удалить?')) {
            await deleteCar(id);
            load();
        }
    };

    const openEdit = (car) => {
        setEditing(car);

        // FIX №2 — нормализация формы (важно)
        setForm({
            clientIds: car.clientIds || [],
            plate: car.plate || '',
            brand: car.brand || '',
            model: car.model || '',
            year: car.year || '',
            bodyType: car.bodyType || 'седан'
        });

        setShow(true);
    };

    return (
        <>
            <Button className="mb-3" onClick={() => setShow(true)}>
                + Авто
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Госномер</th>
                        <th>Марка</th>
                        <th>Модель</th>
                        <th>Год</th>
                        <th>Тип</th>
                        <th>Владельцы</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {cars.map(c => (
                        <tr key={c.id}>
                            <td>{c.plate}</td>
                            <td>{c.brand}</td>
                            <td>{c.model}</td>
                            <td>{c.year}</td>
                            <td>{c.bodyType}</td>

                            {/* FIX №3 — безопасное отображение владельцев */}
                            <td>
                                {Array.isArray(c.clientIds)
                                    ? c.clientIds.join(', ')
                                    : ''}
                            </td>

                            <td>
                                <Button
                                    size="sm"
                                    variant="warning"
                                    onClick={() => openEdit(c)}
                                >
                                    ✏️
                                </Button>

                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => del(c.id)}
                                >
                                    🗑️
                                </Button>
                            </td>
                        </tr>
                    ))}

                    {cars.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Нет данных
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editing ? 'Редактирование' : 'Новое авто'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Control
                        className="mb-2"
                        placeholder="Госномер"
                        value={form.plate}
                        onChange={e => setForm({ ...form, plate: e.target.value })}
                    />

                    <Form.Control
                        className="mb-2"
                        placeholder="Марка"
                        value={form.brand}
                        onChange={e => setForm({ ...form, brand: e.target.value })}
                    />

                    <Form.Control
                        className="mb-2"
                        placeholder="Модель"
                        value={form.model}
                        onChange={e => setForm({ ...form, model: e.target.value })}
                    />

                    <Form.Control
                        className="mb-2"
                        type="number"
                        placeholder="Год"
                        value={form.year}
                        onChange={e => setForm({ ...form, year: e.target.value })}
                    />

                    <Form.Select
                        className="mb-2"
                        value={form.bodyType}
                        onChange={e => setForm({ ...form, bodyType: e.target.value })}
                    >
                        <option>седан</option>
                        <option>внедорожник</option>
                        <option>хэтчбек</option>
                    </Form.Select>

                    <Form.Select
                        multiple
                        className="mb-2"
                        value={form.clientIds}
                        onChange={e =>
                            setForm({
                                ...form,
                                clientIds: Array.from(e.target.selectedOptions, o => +o.value)
                            })
                        }
                    >
                        {clients.map(cl => (
                            <option key={cl.id} value={cl.id}>
                                {cl.name}
                            </option>
                        ))}
                    </Form.Select>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Отмена
                    </Button>

                    <Button onClick={save}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Cars;