import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/api';

const Employees = () => {
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', phone: '', role: '' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const data = await getEmployees();
            console.log("employeesData:", data);
            setItems(Array.isArray(data) ? data : data?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
        }
    };

    const save = async () => {
        try {
            if (editing) {
                await updateEmployee(editing.id, form);
            } else {
                await createEmployee(form);
            }
            setShow(false);
            setEditing(null);
            setForm({ name: '', phone: '', role: '' });
            await load();
        } catch (e) {
            console.error("SAVE ERROR:", e);
        }
    };

    const del = async (id) => {
        if (window.confirm('Удалить?')) {
            await deleteEmployee(id);
            await load();
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            name: item.name || '',
            phone: item.phone || '',
            role: item.role || ''
        });
        setShow(true);
    };

    return (
        <>
            <Button className="mb-3" onClick={() => { setEditing(null); setForm({ name: '', phone: '', role: '' }); setShow(true); }}>
                + Сотрудник
            </Button>

            <Table striped bordered hover>
                <thead><tr><th>Имя</th><th>Телефон</th><th>Роль</th><th></th></tr></thead>
                <tbody>
                    {items.map(e => (
                        <tr key={e.id}>
                            <td>{e.name}</td>
                            <td>{e.phone}</td>
                            <td>{e.role}</td>
                            <td>
                                <Button size="sm" variant="warning" onClick={() => openEdit(e)}>✏️</Button>
                                <Button size="sm" variant="danger" onClick={() => del(e.id)}>🗑️</Button>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && <tr><td colSpan="4" className="text-center">Нет данных</td></tr>}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton><Modal.Title>{editing ? 'Редактирование' : 'Новый сотрудник'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Control className="mb-2" placeholder="Имя" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <Form.Control className="mb-2" placeholder="Телефон" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <Form.Control className="mb-2" placeholder="Роль" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Отмена</Button>
                    <Button onClick={save}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Employees;