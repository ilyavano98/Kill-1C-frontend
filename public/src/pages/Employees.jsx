import React, { useState, useEffect } from 'react';
import {Button, Modal, Form, Spinner} from 'react-bootstrap';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/api';
import {DataTable} from "./components/DataTable";

const Employees = () => {
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', phone: '', role: '' });

    // Лоадер и уведомления
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getEmployees();
            console.log("employeesData:", data);
            setItems(Array.isArray(data) ? data : data?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
        } finally {
            setLoading(false);
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


    // Конфигурация колонок для DataTable
    const columns = [
        {
            key: 'name',
            label: 'Имя',
            filterType: 'text'
        },
        {
            key: 'phone',
            label: 'Телефон',
            filterType: 'text'
        },
        {
            key: 'role',
            label: 'Роль',
            filterType: 'text'
        }
    ];

    const addButton = (
        <Button onClick={() => {
            setEditing(null);
            setForm({ name: '', phone: '', role: '' });
            setShow(true);
        }}>
            + Сотрудник
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