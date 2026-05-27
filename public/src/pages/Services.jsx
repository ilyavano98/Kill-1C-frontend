import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getServices, createService, updateService, deleteService } from '../api/api';

const Services = () => {
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', type: 'мойка', price: '' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const data = await getServices();
            console.log("servicesData:", data);
            setItems(Array.isArray(data) ? data : data?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
        }
    };

    const save = async () => {
        try {
            const payload = { ...form, price: Number(form.price) };
            if (editing) {
                await updateService(editing.id, payload);
            } else {
                await createService(payload);
            }
            setShow(false);
            setEditing(null);
            setForm({ name: '', type: 'мойка', price: '' });
            await load();
        } catch (e) {
            console.error("SAVE ERROR:", e);
        }
    };

    const del = async (id) => {
        if (window.confirm('Удалить?')) {
            await deleteService(id);
            await load();
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            name: item.name || '',
            type: item.type || 'мойка',
            price: item.price || ''
        });
        setShow(true);
    };

    return (
        <>
            <Button className="mb-3" onClick={() => { setEditing(null); setForm({ name: '', type: 'мойка', price: '' }); setShow(true); }}>
                + Услуга
            </Button>

            <Table striped bordered hover>
                <thead><tr><th>Название</th><th>Тип</th><th>Цена</th><th></th></tr></thead>
                <tbody>
                    {items.map(s => (
                        <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>{s.type === 'мойка' ? 'Мойка' : 'Доп. услуга'}</td>
                            <td>{s.price} ₽</td>
                            <td>
                                <Button size="sm" variant="warning" onClick={() => openEdit(s)}>✏️</Button>
                                <Button size="sm" variant="danger" onClick={() => del(s.id)}>🗑️</Button>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && <tr><td colSpan="4" className="text-center">Нет данных</td></tr>}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton><Modal.Title>{editing ? 'Редактирование' : 'Новая услуга'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Control className="mb-2" placeholder="Название" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <Form.Select className="mb-2" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="мойка">Мойка</option>
                        <option value="доп">Доп. услуга</option>
                    </Form.Select>
                    <Form.Control className="mb-2" type="number" placeholder="Цена" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Отмена</Button>
                    <Button onClick={save}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Services;