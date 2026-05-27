import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getCarWashes, createCarWash, updateCarWash, deleteCarWash } from '../api/api';

const CarWashes = () => {
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', address: '', isActive: true });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const data = await getCarWashes();
            console.log("carWashesData:", data);
            setItems(Array.isArray(data) ? data : data?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
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

    return (
        <>
            <Button className="mb-3" onClick={() => { setEditing(null); setForm({ name: '', address: '', isActive: true }); setShow(true); }}>
                + Мойка
            </Button>

            <Table striped bordered hover>
                <thead><tr><th>Название</th><th>Адрес</th><th>Активна</th><th></th></tr></thead>
                <tbody>
                    {items.map(cw => (
                        <tr key={cw.id}>
                            <td>{cw.name}</td>
                            <td>{cw.address}</td>
                            <td>{cw.isActive ? 'Да' : 'Нет'}</td>
                            <td>
                                <Button size="sm" variant="warning" onClick={() => openEdit(cw)}>✏️</Button>
                                <Button size="sm" variant="danger" onClick={() => del(cw.id)}>🗑️</Button>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && <tr><td colSpan="4" className="text-center">Нет данных</td></tr>}
                </tbody>
            </Table>

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