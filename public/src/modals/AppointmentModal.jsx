import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import {formatDateTime} from "../functions/Functions";

export const AppointmentModal = ({
                              show,
                              onHide,
                              editing,
                              form,
                              setForm,
                              clients,
                              cars,
                              services,
                              employees,
                              bays,
                              onSave
                          }) => {
    // Фильтрация автомобилей по выбранному клиенту
    const filteredCars = cars.filter(car => car.clientIds?.includes(Number(form.clientId)));

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{editing ? 'Редактирование записи' : 'Новая запись'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control
                    className="mb-2"
                    type="datetime-local"
                    value={form.dateTime || ''}
                    onChange={e => setForm({ ...form, dateTime: e.target.value })}
                />

                <Form.Select
                    className="mb-2"
                    value={form.clientId || ''}
                    onChange={e => setForm({ ...form, clientId: e.target.value, carId: '' })}
                >
                    <option value="">Выберите клиента</option>
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </Form.Select>

                <Form.Select
                    className="mb-2"
                    value={form.carId || ''}
                    onChange={e => setForm({ ...form, carId: e.target.value })}
                    disabled={!form.clientId}
                >
                    <option value="">Выберите авто</option>
                    {filteredCars.map(car => (
                        <option key={car.id} value={car.id}>{car.plate}</option>
                    ))}
                </Form.Select>

                <Form.Select
                    className="mb-2"
                    value={form.serviceId || ''}
                    onChange={e => {
                        const selectedService = services.find(s => s.id == e.target.value);
                        setForm({
                            ...form,
                            serviceId: e.target.value,
                            price: selectedService?.price || ''
                        });
                    }}
                >
                    <option value="">Выберите услугу</option>
                    {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.price} ₽)</option>
                    ))}
                </Form.Select>

                <Form.Select
                    className="mb-2"
                    value={form.employeeId || ''}
                    onChange={e => setForm({ ...form, employeeId: e.target.value })}
                >
                    <option value="">Выберите сотрудника</option>
                    {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                </Form.Select>

                <Form.Select
                    className="mb-2"
                    value={form.washBayId || ''}
                    onChange={e => setForm({ ...form, washBayId: e.target.value })}
                >
                    <option value="">Не выбрано</option>
                    {bays.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </Form.Select>

                <Form.Select
                    className="mb-2"
                    value={form.status || ''}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                >
                    <option value="pending">Ожидает</option>
                    <option value="confirmed">Подтверждена</option>
                    <option value="arrived">Приехал</option>
                    <option value="in_wash">На мойке</option>
                    <option value="completed">Завершена</option>
                    <option value="cancelled">Отменена</option>
                </Form.Select>

                <Form.Control
                    className="mb-2"
                    type="number"
                    placeholder="Цена"
                    value={form.price || ''}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                />

                <Form.Control
                    as="textarea"
                    placeholder="Комментарий"
                    value={form.comment || ''}
                    onChange={e => setForm({ ...form, comment: e.target.value })}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button onClick={onSave}>Сохранить</Button>
            </Modal.Footer>
        </Modal>
    );
};