import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getShifts, getEmployees, createShift, updateShift, deleteShift } from '../api/api';

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

    return (
        <>
            <Button className="mb-3" onClick={() => { setEditing(null); setForm({ date: '', employeeId: '', start: '', end: '', carsCount: '' }); setShow(true); }}>
                + Смена
            </Button>

            <Table striped bordered hover>
                <thead><tr><th>Дата</th><th>Сотрудник</th><th>Начало</th><th>Конец</th><th>Машин</th><th></th></tr></thead>
                <tbody>
                    {items.map(s => {
                        const emp = employees.find(e => e.id === s.employeeId);
                        return (
                            <tr key={s.id}>
                                <td>{s.date}</td>
                                <td>{emp?.name || s.employeeId}</td>
                                <td>{s.start}</td>
                                <td>{s.end}</td>
                                <td>{s.carsCount}</td>
                                <td>
                                    <Button size="sm" variant="warning" onClick={() => openEdit(s)}>✏️</Button>
                                    <Button size="sm" variant="danger" onClick={() => del(s.id)}>🗑️</Button>
                                </td>
                            </tr>
                        );
                    })}
                    {items.length === 0 && <tr><td colSpan="6" className="text-center">Нет данных</td></tr>}
                </tbody>
            </Table>

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