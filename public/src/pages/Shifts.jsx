import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getShifts, getEmployees, createShift, updateShift, deleteShift } from '../api/api';
import {formatDateTime} from "../functions/Functions";
import {DataTable} from "./components/DataTable";

const Shifts = () => {
    const [items, setItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ date: '', employeeId: '', start: '', end: '', carsCount: '' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const shiftsData = await getShifts();
            const employeesData = await getEmployees();
            console.log("shiftsData:", shiftsData);
            setItems(Array.isArray(shiftsData) ? shiftsData : shiftsData?.data || []);
            setEmployees(Array.isArray(employeesData) ? employeesData : employeesData?.data || []);
        } catch (e) {
            console.error("LOAD ERROR:", e);
        }
    };

    const save = async () => {
        try {
            const payload = { ...form, carsCount: Number(form.carsCount) };
            if (editing) {
                await updateShift(editing.id, payload);
            } else {
                await createShift(payload);
            }
            setShow(false);
            setEditing(null);
            setForm({ date: '', employeeId: '', start: '', end: '', carsCount: '' });
            await load();
        } catch (e) {
            console.error("SAVE ERROR:", e);
        }
    };

    const del = async (id) => {
        if (window.confirm('Удалить?')) {
            await deleteShift(id);
            await load();
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            date: item.date || '',
            employeeId: item.employeeId || '',
            start: item.start || '',
            end: item.end || '',
            carsCount: item.carsCount || ''
        });
        setShow(true);
    };

    const getEmployeeName = (id) => employees.find(c => c.id === id)?.name || id || '—';

    // Конфигурация колонок для DataTable
    const columns = [
        {
            key: 'date',
            label: 'Дата',
            filterType: 'date'
        },
        {
            key: 'employee',
            label: 'Сотрудник',
            filterType: 'text',
            getDisplayValue: (item) => getEmployeeName(item.employeeId)
        },
        {
            key: 'start',
            label: 'Начало',
            filterType: 'text'
        },
        {
            key: 'end',
            label: 'Конец',
            filterType: 'text'
        },
        {
            key: 'carsCount',
            label: 'Количество автомобилей',
            filterType: 'number'
        }
    ];

    const addButton = (
        <Button onClick={() => {
            setEditing(null);
            setForm({ date: '', employeeId: '', start: '', end: '', carsCount: '' });
            setShow(true);
        }}>
            + Смена
        </Button>
    );

    return (
        <>
            <DataTable
                data={items}
                columns={columns}
                idField="id"
                itemsPerPage={12}
                addButton={addButton}
                onEdit={openEdit}
                onDelete={del}
            />

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton><Modal.Title>{editing ? 'Редактирование' : 'Новая смена'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Control className="mb-2" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    <Form.Select className="mb-2" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}>
                        <option value="">Выберите сотрудника</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </Form.Select>
                    <Form.Control className="mb-2" type="time" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
                    <Form.Control className="mb-2" type="time" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
                    <Form.Control className="mb-2" type="number" placeholder="Авто обработано" value={form.carsCount} onChange={e => setForm({ ...form, carsCount: e.target.value })} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Отмена</Button>
                    <Button onClick={save}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Shifts;