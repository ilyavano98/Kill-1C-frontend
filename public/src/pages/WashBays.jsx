import React, { useState, useEffect } from 'react';
import {Table, Button, Modal, Form, Spinner} from 'react-bootstrap';
import { getWashBays, getCarWashes, createWashBay, updateWashBay, deleteWashBay } from '../api/api';
import {DataTable} from "./components/DataTable";

const WashBays = () => {
    const [items, setItems] = useState([]);
    const [carwashes, setCarwashes] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ carWashId: '', name: '', description: '', isActive: true });

    // Лоадер и уведомления
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const washBaysData = await getWashBays();
            const carWashesData = await getCarWashes();
            console.log("washBaysData:", washBaysData);
            setItems(Array.isArray(washBaysData) ? washBaysData : washBaysData?.data || []);
            setCarwashes(Array.isArray(carWashesData) ? carWashesData : carWashesData?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
        } finally {
            setLoading(false);
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

    const getWashValue = (id) => carwashes.find(c => c.id === id)?.name || id || '—';

    // Конфигурация колонок для DataTable
    const columns = [
        {
            key: 'name',
            label: 'Название',
            filterType: 'text'
        },
        {
            key: 'carWashId',
            label: 'Статус',
            filterType: 'text',
            getDisplayValue: (item) => getWashValue(item.carWashId)
        },
        {
            key: 'isActive',
            label: 'Активно',
            filterType: 'text',
            format: (val) => `${val ? 'Да' : 'Нет'}`
        }
    ];

    const addButton = (
        <Button onClick={() => {
            setEditing(null);
            setForm({ carWashId: '', name: '', description: '', isActive: true });
            setShow(true);
        }}>
            + Место
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