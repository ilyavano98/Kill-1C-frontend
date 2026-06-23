import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EntityModal = ({
                         show,
                         onHide,
                         title,
                         fields,
                         form,
                         setForm,
                         onSave,
                         loading,
                     }) => {
    const handleChange = (e, field) => {
        const { value, type, checked } = e.target;
        let newValue = value;

        if (type === 'checkbox') {
            newValue = checked;
        } else if (type === 'select-multiple') {
            // для multiple select: собираем массив значений
            newValue = Array.from(e.target.selectedOptions, opt => opt.value);
        } else if (field.fieldType === 'number') {
            newValue = value === '' ? '' : Number(value);
        }

        setForm({ ...form, [field.key]: newValue });
    };

    const renderField = (field) => {
        const value = form[field.key] ?? '';
        const commonProps = {
            className: 'mb-2',
            value: value,
            onChange: (e) => handleChange(e, field),
            disabled: loading,
        };

        switch (field.fieldType) {
            case 'select':
                return (
                    <Form.Select {...commonProps}>
                        <option value="">{field.placeholder || 'Выберите'}</option>
                        {field.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Form.Select>
                );
            case 'selectMultiple':
                return (
                    <Form.Select {...commonProps} multiple>
                        {field.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Form.Select>
                );
            case 'textarea':
                return <Form.Control as="textarea" {...commonProps} placeholder={field.placeholder} />;
            case 'datetime':
                return <Form.Control className="mb-2" type="datetime-local" {...commonProps} placeholder={field.placeholder} />;
            case 'checkbox':
                return <Form.Check type="checkbox" label={field.label} checked={!!value} onChange={(e) => handleChange(e, field)} disabled={loading} />;
            default:
                return <Form.Control type={field.fieldType || 'text'} {...commonProps} placeholder={field.placeholder} />;
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {fields.map((field, idx) => (
                    <div key={idx}>
                        {renderField(field)}
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>Отмена</Button>
                <Button onClick={onSave} disabled={loading}>Сохранить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EntityModal;