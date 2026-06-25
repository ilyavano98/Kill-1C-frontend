import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Button, Card, Image, Tabs, Tab, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getWidgets, createWidget, updateWidget, deleteWidget } from '../api/api';

const defaultWidget = {
    name: 'Виджет заявок',
    config: {
        title: 'Записаться на мойку',
        buttonText: 'Отправить',
        successText: 'Спасибо! Мы свяжемся с вами.',
        errorText: 'Ошибка, попробуйте позже.',
        theme: {
            primaryColor: '#2563eb',
            buttonColor: '#2563eb',
            buttonTextColor: '#ffffff',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            backgroundImage: '',
        },
        fields: [
            { id: 'name', type: 'text', label: 'Имя', required: true, placeholder: 'Введите имя' },
            { id: 'phone', type: 'tel', label: 'Телефон', required: true, placeholder: '+7...' },
            { id: 'service', type: 'select', label: 'Услуга', required: true, options: ['Мойка', 'Полировка', 'Химчистка'] },
            { id: 'comment', type: 'textarea', label: 'Комментарий', required: false, placeholder: 'Дополнительная информация' },
        ],
        display: {
            type: 'floatingButton',
            buttonLabel: 'Записаться',
        },
    },
};

export const WidgetEditor = () => {
    const [widget, setWidget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadWidget();
    }, []);

    const loadWidget = async () => {
        setLoading(true);
        try {
            const widgets = await getWidgets();
            if (widgets.length === 0) {
                const newWidget = await createWidget(defaultWidget);
                setWidget(newWidget);
            } else {
                setWidget(widgets[0]);
            }
        } catch (err) {
            setMessage({ variant: 'danger', text: 'Ошибка загрузки виджета' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (path, value) => {
        setWidget(prev => {
            const newWidget = { ...prev };
            const keys = path.split('.');
            let current = newWidget;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newWidget;
        });
    };

    const handleConfigChange = (path, value) => {
        setWidget(prev => {
            const newWidget = { ...prev };
            const keys = path.split('.');
            let current = newWidget.config;
            for (let i = 1; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newWidget;
        });
    };

    const handleFieldChange = (index, key, value) => {
        setWidget(prev => {
            const newWidget = { ...prev };
            if (!newWidget.config.fields[index]) return newWidget;
            newWidget.config.fields[index][key] = value;
            return newWidget;
        });
    };

    const addField = () => {
        const newField = {
            id: `field_${Date.now()}`,
            type: 'text',
            label: 'Новое поле',
            required: false,
            placeholder: '',
        };
        setWidget(prev => ({
            ...prev,
            config: {
                ...prev.config,
                fields: [...prev.config.fields, newField],
            },
        }));
    };

    const removeField = (index) => {
        setWidget(prev => ({
            ...prev,
            config: {
                ...prev.config,
                fields: prev.config.fields.filter((_, i) => i !== index),
            },
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            handleConfigChange('config.theme.backgroundImage', reader.result);
        };
        reader.readAsDataURL(file);
    };

    const saveWidget = async () => {
        setSaving(true);
        try {
            await updateWidget(widget.id, widget);
            setMessage({ variant: 'success', text: 'Виджет сохранён' });
        } catch (err) {
            setMessage({ variant: 'danger', text: 'Ошибка сохранения' });
        } finally {
            setSaving(false);
        }
    };

    const deleteWidgetHandler = async () => {
        if (!window.confirm('Удалить виджет?')) return;
        try {
            await deleteWidget(widget.id);
            setMessage({ variant: 'success', text: 'Виджет удалён' });
            navigate('/settings');
        } catch (err) {
            setMessage({ variant: 'danger', text: 'Ошибка удаления' });
        }
    };

    if (loading) return <Container className="py-4"><p>Загрузка...</p></Container>;
    if (!widget) return <Container className="py-4"><p>Виджет не найден</p></Container>;

    return (
        <Container fluid className="py-4">
            <Row>
                <Col md={8}>
                    <h2>Редактор виджета</h2>
                    {message && <Alert variant={message.variant} onClose={() => setMessage(null)} dismissible>{message.text}</Alert>}

                    <Tabs defaultActiveKey="basic" className="mb-3">
                        <Tab eventKey="basic" title="Основные">
                            <Form.Group className="mb-3">
                                <Form.Label>Название виджета (для админа)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={widget.name || ''}
                                    onChange={e => handleChange('name', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Заголовок формы</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={widget.config.title || ''}
                                    onChange={e => handleConfigChange('config.title', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Текст кнопки</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={widget.config.buttonText || ''}
                                    onChange={e => handleConfigChange('config.buttonText', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Текст успеха</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={widget.config.successText || ''}
                                    onChange={e => handleConfigChange('config.successText', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Текст ошибки</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={widget.config.errorText || ''}
                                    onChange={e => handleConfigChange('config.errorText', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Тип отображения</Form.Label>
                                <Form.Select
                                    value={widget.config.display.type || 'floatingButton'}
                                    onChange={e => handleConfigChange('config.display.type', e.target.value)}
                                >
                                    <option value="floatingButton">Плавающая кнопка</option>
                                    <option value="inline">Встроенная форма</option>
                                    <option value="modal">Модальное окно</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Текст кнопки вызова (для floatingButton)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={widget.config.display.buttonLabel || ''}
                                    onChange={e => handleConfigChange('config.display.buttonLabel', e.target.value)}
                                />
                            </Form.Group>
                        </Tab>

                        <Tab eventKey="fields" title="Поля формы">
                            {widget.config.fields.map((field, idx) => (
                                <Card key={idx} className="mb-3 p-3">
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label>Метка</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={field.label || ''}
                                                    onChange={e => handleFieldChange(idx, 'label', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>Тип</Form.Label>
                                                <Form.Select
                                                    value={field.type || 'text'}
                                                    onChange={e => handleFieldChange(idx, 'type', e.target.value)}
                                                >
                                                    <option value="text">Текст</option>
                                                    <option value="tel">Телефон</option>
                                                    <option value="email">Email</option>
                                                    <option value="select">Выпадающий список</option>
                                                    <option value="textarea">Многострочный текст</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={2}>
                                            <Form.Group>
                                                <Form.Label>Обязательное</Form.Label>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={field.required || false}
                                                    onChange={e => handleFieldChange(idx, 'required', e.target.checked)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3} className="d-flex align-items-end justify-content-end">
                                            <Button variant="danger" onClick={() => removeField(idx)}>Удалить</Button>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Placeholder</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={field.placeholder || ''}
                                                    onChange={e => handleFieldChange(idx, 'placeholder', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        {field.type === 'select' && (
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Опции (через запятую)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={(field.options || []).join(', ')}
                                                        onChange={e => handleFieldChange(idx, 'options', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )}
                                    </Row>
                                </Card>
                            ))}
                            <Button variant="outline-primary" onClick={addField}>Добавить поле</Button>
                        </Tab>

                        <Tab eventKey="design" title="Дизайн">
                            <Form.Group className="mb-3">
                                <Form.Label>Основной цвет</Form.Label>
                                <Form.Control
                                    type="color"
                                    value={widget.config.theme.primaryColor || '#2563eb'}
                                    onChange={e => handleConfigChange('config.theme.primaryColor', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Цвет кнопки</Form.Label>
                                <Form.Control
                                    type="color"
                                    value={widget.config.theme.buttonColor || '#2563eb'}
                                    onChange={e => handleConfigChange('config.theme.buttonColor', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Цвет текста на кнопке</Form.Label>
                                <Form.Control
                                    type="color"
                                    value={widget.config.theme.buttonTextColor || '#ffffff'}
                                    onChange={e => handleConfigChange('config.theme.buttonTextColor', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Цвет фона формы</Form.Label>
                                <Form.Control
                                    type="color"
                                    value={widget.config.theme.backgroundColor || '#ffffff'}
                                    onChange={e => handleConfigChange('config.theme.backgroundColor', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Скругление углов (px)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={widget.config.theme.borderRadius || '8px'}
                                    onChange={e => handleConfigChange('config.theme.borderRadius', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Фоновое изображение</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                                {widget.config.theme.backgroundImage && (
                                    <div className="mt-2">
                                        <Image src={widget.config.theme.backgroundImage} thumbnail style={{ maxHeight: 200, maxWidth: '100%' }} />
                                        <Button variant="outline-danger" size="sm" className="mt-1" onClick={() => handleConfigChange('config.theme.backgroundImage', '')}>
                                            Удалить
                                        </Button>
                                    </div>
                                )}
                            </Form.Group>
                        </Tab>

                        <Tab eventKey="embed" title="Код вставки">
                            <Form.Group className="mb-3">
                                <Form.Label>Скопируйте этот код и вставьте на свой сайт</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    value={`<script src="https://your-domain.com/widget.js?id=${widget.id}"></script>`}
                                    readOnly
                                />
                            </Form.Group>
                        </Tab>
                    </Tabs>

                    <div className="d-flex gap-2 mt-3">
                        <Button variant="primary" onClick={saveWidget} disabled={saving}>
                            {saving ? 'Сохранение...' : 'Сохранить виджет'}
                        </Button>
                        <Button variant="outline-danger" onClick={deleteWidgetHandler}>Удалить виджет</Button>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="border rounded p-3 bg-light sticky-top" style={{ top: 20 }}>
                        <h5>Предпросмотр</h5>
                        <div
                            style={{
                                backgroundColor: widget.config.theme.backgroundColor || '#ffffff',
                                borderRadius: widget.config.theme.borderRadius || '8px',
                                padding: '20px',
                                backgroundImage: widget.config.theme.backgroundImage ? `url(${widget.config.theme.backgroundImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <h4 style={{ color: widget.config.theme.primaryColor || '#2563eb' }}>{widget.config.title}</h4>
                            <form>
                                {widget.config.fields.map((field, idx) => (
                                    <div key={idx} className="mb-2">
                                        <label>{field.label}</label>
                                        {field.type === 'select' ? (
                                            <select className="form-control">
                                                <option>--</option>
                                                {(field.options || []).map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                        ) : field.type === 'textarea' ? (
                                            <textarea className="form-control" placeholder={field.placeholder} />
                                        ) : (
                                            <input type={field.type} className="form-control" placeholder={field.placeholder} />
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn w-100"
                                    style={{
                                        backgroundColor: widget.config.theme.buttonColor || '#2563eb',
                                        color: widget.config.theme.buttonTextColor || '#ffffff',
                                        borderRadius: widget.config.theme.borderRadius || '8px',
                                    }}
                                >
                                    {widget.config.buttonText}
                                </button>
                            </form>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default WidgetEditor;