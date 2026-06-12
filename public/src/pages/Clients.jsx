import React, { useState, useEffect } from 'react';
import {Table, Button, Modal, Form, Spinner} from 'react-bootstrap';
import { getClients, createClient, updateClient, deleteClient } from '../api/api';
import {DataTable} from "./components/DataTable";

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', phone: '', email: '', preferences: '' });

    // Лоадер и уведомления
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getClients();
            console.log("clientsData:", data);
            setClients(Array.isArray(data) ? data : data?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
        } finally {
            setLoading(false);
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

    // Конфигурация колонок для DataTable
    const columns = [
        {
            key: 'name',
            label: 'ФИО',
            filterType: 'text'
        },
        {
            key: 'phone',
            label: 'Телефон',
            filterType: 'text'
        },
        {
            key: 'email',
            label: 'Электронная почта',
            filterType: 'text'
        }
    ];

    const addButton = (
        <Button onClick={() => {
            setEditing(null);
            setForm({ name: '', phone: '', email: '', preferences: '' });
            setShow(true);
        }}>
            + Клиент
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
                    data={clients}
                    columns={columns}
                    idField="id"
                    itemsPerPage={12}
                    addButton={addButton}
                    onEdit={openEdit}
                    onDelete={del}
                />
            )}

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