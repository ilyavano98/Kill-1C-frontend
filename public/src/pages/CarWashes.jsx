import React, { useState, useEffect } from 'react';
import {Table, Button, Modal, Form, Spinner} from 'react-bootstrap';
import { getCarWashes, createCarWash, updateCarWash, deleteCarWash } from '../api/api';
import {DataTable} from "./components/DataTable";

const CarWashes = () => {
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', address: '', isActive: true });

    // Лоадер и уведомления
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true)
        try {
            const data = await getCarWashes();
            console.log("carWashesData:", data);
            setItems(Array.isArray(data) ? data : data?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
        } finally {
            setLoading(false)
        }
    };

    const save = async () => {
        try {
            if (editing) {
                await updateCarWash(editing.id, form);
            } else {
                await createCarWash(form);
            }
            setShow(false);
            setEditing(null);
            setForm({ name: '', address: '', isActive: true });
            await load();
        } catch (e) {
            console.error("SAVE ERROR:", e);
        }
    };

    const del = async (id) => {
        if (window.confirm('Удалить?')) {
            await deleteCarWash(id);
            await load();
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            name: item.name || '',
            address: item.address || '',
            isActive: item.isActive !== undefined ? item.isActive : true
        });
        setShow(true);
    };

    // Конфигурация колонок для DataTable
    const columns = [
        {
            key: 'name',
            label: 'Название',
            filterType: 'text'
        },
        {
            key: 'address',
            label: 'Адрес',
            filterType: 'text'
        },
        {
            key: 'isActive',
            label: 'Активна',
            filterType: 'text',
            format: (val) => `${val ? 'Да' : 'Нет'}`
        }
    ];

    const addButton = (
        <Button onClick={() => {
            setEditing(null);
            setForm({ name: '', address: '', isActive: true });
            setShow(true);
        }}>
            + Мойка
        </Button>
    );

    return (
        <>
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

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton><Modal.Title>{editing ? 'Редактирование' : 'Новая мойка'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Control className="mb-2" placeholder="Название мойки" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <Form.Control className="mb-2" placeholder="Адрес" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                    <Form.Check type="checkbox" label="Активна" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Отмена</Button>
                    <Button onClick={save}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CarWashes;