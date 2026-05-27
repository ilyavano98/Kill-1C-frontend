import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getClients, createClient, updateClient, deleteClient } from '../api/api';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', phone: '', email: '', preferences: '' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const data = await getClients();
            console.log("clientsData:", data);
            setClients(Array.isArray(data) ? data : data?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
        }
    };

    const save = async () => {
        try {
            if (editing) {
                await updateClient(editing.id, form);
            } else {
                await createClient(form);
            }
            setShow(false);
            setEditing(null);
            setForm({ name: '', phone: '', email: '', preferences: '' });
            await load();
        } catch (e) {
            console.error("SAVE ERROR:", e);
        }
    };

    const del = async (id) => {
        if (window.confirm('Удалить?')) {
            await deleteClient(id);
            await load();
        }
    };

    const openEdit = (client) => {
        setEditing(client);
        setForm({
            name: client.name || '',
            phone: client.phone || '',
            email: client.email || '',
            preferences: client.preferences || ''
        });
        setShow(true);
    };

    return (
        <>
            <Button className="mb-3" onClick={() => { setEditing(null); setForm({ name: '', phone: '', email: '', preferences: '' }); setShow(true); }}>
                + Клиент
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr><th>Имя</th><th>Телефон</th><th>Email</th><th>Действия</th></tr>
                </thead>
                <tbody>
                    {clients.map(c => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.phone}</td>
                            <td>{c.email}</td>
                            <td>
                                <Button size="sm" variant="warning" onClick={() => openEdit(c)}>✏️</Button>
                                <Button size="sm" variant="danger" onClick={() => del(c.id)}>🗑️</Button>
                            </td>
                        </tr>
                    ))}
                    {clients.length === 0 && <tr><td colSpan="4" className="text-center">Нет данных</td></tr>}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton><Modal.Title>{editing ? 'Редактирование' : 'Новый клиент'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Control className="mb-2" placeholder="Имя" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <Form.Control className="mb-2" placeholder="Телефон" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <Form.Control className="mb-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <Form.Control as="textarea" placeholder="Предпочтения" value={form.preferences} onChange={e => setForm({ ...form, preferences: e.target.value })} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Отмена</Button>
                    <Button onClick={save}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Clients;