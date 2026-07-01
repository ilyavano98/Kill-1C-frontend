import React, { useState, useEffect } from 'react';
import './styles.css';

const WIDGET_VERSION = process.env.WIDGET_VERSION || '1.0.0';

const WidgetApp = ({ widgetId }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [status, setStatus] = useState(null); // 'idle' | 'success' | 'error'
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Загружаем конфиг виджета
        const fetchConfig = async () => {
            try {
                const response = await fetch(`/api/widgets/${widgetId}/config`);
                if (!response.ok) throw new Error('Failed to load config');
                const data = await response.json();
                setConfig(data);
                // Инициализируем formData пустыми значениями
                const initialData = {};
                data.fields.forEach(field => {
                    initialData[field.id] = '';
                });
                setFormData(initialData);
            } catch (err) {
                console.error('Widget config error:', err);
                setStatus('error');
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [widgetId]);

    const handleChange = (fieldId, value) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);

        try {
            const response = await fetch(`/api/widgets/${widgetId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields: formData }),
            });
            if (!response.ok) throw new Error('Submit failed');
            setStatus('success');
            // Через 3 секунды закрываем форму
            setTimeout(() => {
                setOpen(false);
                setStatus(null);
                // Сбрасываем форму (опционально)
                const resetData = {};
                config.fields.forEach(field => {
                    resetData[field.id] = '';
                });
                setFormData(resetData);
            }, 3000);
        } catch (err) {
            console.error('Submit error:', err);
            setStatus('error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="crm-widget-container">
                <div className="crm-widget-button" style={{ background: '#94a3b8', cursor: 'default' }}>
                    <span>...</span>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="crm-widget-container">
                <div className="crm-widget-form open">
                    <div className="message error">Ошибка загрузки виджета</div>
                </div>
            </div>
        );
    }

    const { config: widgetConfig } = config;

    return (
        <div className="crm-widget-container">
            <button className="crm-widget-button" onClick={() => setOpen(!open)}>
                {widgetConfig.display.buttonLabel || '✉️'}
            </button>
            <div className={`crm-widget-form ${open ? 'open' : ''}`}>
                <h3>{widgetConfig.title}</h3>
                {status === 'success' ? (
                    <div className="message success">{widgetConfig.successText}</div>
                ) : status === 'error' ? (
                    <div className="message error">{widgetConfig.errorText}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {widgetConfig.fields.map(field => (
                            <div key={field.id} className="field-group">
                                <label>{field.label}</label>
                                {field.type === 'select' ? (
                                    <select
                                        required={field.required}
                                        value={formData[field.id] || ''}
                                        onChange={e => handleChange(field.id, e.target.value)}
                                    >
                                        <option value="">Выберите</option>
                                        {field.options.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        required={field.required}
                                        placeholder={field.placeholder}
                                        value={formData[field.id] || ''}
                                        onChange={e => handleChange(field.id, e.target.value)}
                                        rows={3}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        required={field.required}
                                        placeholder={field.placeholder}
                                        value={formData[field.id] || ''}
                                        onChange={e => handleChange(field.id, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                        <button type="submit" className="submit-btn" disabled={submitting}>
                            {submitting ? 'Отправка...' : widgetConfig.buttonText}
                        </button>
                    </form>
                )}
                <div style={{ marginTop: 12, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
                    v{WIDGET_VERSION}
                </div>
            </div>
        </div>
    );
};

export default WidgetApp;