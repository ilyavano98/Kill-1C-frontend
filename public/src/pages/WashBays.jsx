import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getWashBays, getCarWashes, createWashBay, updateWashBay, deleteWashBay } from '../api/api';

const WashBays = () => {
    const [items, setItems] = useState([]);
    const [carwashes, setCarwashes] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ carWashId: '', name: '', description: '', isActive: true });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const washBaysData = await getWashBays();
            const carWashesData = await getCarWashes();
            console.log("washBaysData:", washBaysData);
            setItems(Array.isArray(washBaysData) ? washBaysData : washBaysData?.data || []);
            setCarwashes(Array.isArray(carWashesData) ? carWashesData : carWashesData?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
        }
    };

    const save = async () => {
        try {
            if (editing) {
                await updateWashBay(editing.id, form);
            } else {
                await createWashBay(form);
            }
            setShow(false);
            setEditing(null);
            setForm({ carWashId: '', name: '', description: '', isActive: true });
            await load();
        } catch (e) {
            console.error("SAVE ERROR:", e);
        }
    };

    const del = async (id) => {
        if (window.confirm('Удалить?')) {
            await deleteWashBay(id);
            await load();
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            carWashId: item.carWashId || '',
            name: item.name || '',
            description: item.description || '',
            isActive: item.isActive !== undefined ? item.isActive : true
        });
        setShow(true);
    };

    return (
        <>
            <Button className="mb-3" onClick={() => { setEditing(null); setForm({ carWashId: '', name: '', description: '', isActive: true }); setShow(true); }}>
                + Место
            </Button>

            <Table striped bordered hover>
                <thead><tr><th>Название</th><th>Мойка</th><th>Активно</th><th></th></tr></thead>
                <tbody>
                    {items.map(b => {
                        const cw = carwashes.find(c => c.id === b.carWashId);
                        return (
                            <tr key={b.id}>
                                <td>{b.name}</td>
                                <td>{cw?.name || b.carWashId}</td>
                                <td>{b.isActive ? 'Да' : 'Нет'}</td>
                                <td>
                                    <Button size="sm" variant="warning" onClick={() => openEdit(b)}>✏️</Button>
                                    <Button size="sm" variant="danger" onClick={() => del(b.id)}>🗑️</Button>
                                </td>
                            </tr>
                        );
                    })}
                    {items.length === 0 && <tr><td colSpan="4" className="text-center">Нет данных</td></tr>}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton><Modal.Title>{editing ? 'Редактирование' : 'Новое место'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Select className="mb-2" value={form.carWashId} onChange={e => setForm({ ...form, carWashId: e.target.value })}>
                        <option value="">Выберите мойку</option>
                        {carwashes.map(cw => <option key={cw.id} value={cw.id}>{cw.name}</option>)}
                    </Form.Select>
                    <Form.Control className="mb-2" placeholder="Название места" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <Form.Control className="mb-2" placeholder="Описание" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <Form.Check type="checkbox" label="Активно" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Отмена</Button>
                    <Button onClick={save}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default WashBays;