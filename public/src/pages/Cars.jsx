import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getCars, getClients, createCar, updateCar, deleteCar } from '../api/api';
import {DataTable} from "./components/DataTable";

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

    const getCarOwnersValue = (clientIds) => clientIds
            .map(clientId => clients.find(client => client.id === clientId)?.name || '—')
            .join(', ');



    // Конфигурация колонок для DataTable
    const columns = [
        {
            key: 'plate',
            label: 'Госномер',
            filterType: 'text'
        },
        {
            key: 'brand',
            label: 'Марка',
            filterType: 'text'
        },
        {
            key: 'model',
            label: 'Модель',
            filterType: 'text'
        },
        {
            key: 'year',
            label: 'Год',
            filterType: 'number'
        },
        {
            key: 'bodyType',
            label: 'Тип',
            filterType: 'text'
        },
        {
            key: 'carOwner',
            label: 'Владельцы',
            filterType: 'text',
            getDisplayValue: (item) => getCarOwnersValue(item.clientIds)
        },
    ];

    const addButton = (
        <Button onClick={() => {
            setShow(true);
        }}>
            + Авто
        </Button>
    );

    return (
        <>
            <DataTable
                data={cars}
                columns={columns}
                idField="id"
                itemsPerPage={12}
                addButton={addButton}
                onEdit={openEdit}
                onDelete={del}
            />

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