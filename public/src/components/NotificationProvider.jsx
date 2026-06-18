import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from 'react-bootstrap';

// Контекст
const NotificationContext = createContext();

// Провайдер
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Добавить уведомление
    const addNotification = useCallback((message, variant = 'success') => {
        const id = Date.now() + Math.random();
        setNotifications((prev) => [...prev, { id, message, variant }]);

        // Автоматическое удаление через 3 секунды
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 3000);
    }, []);

    // Удалить вручную
    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
            {children}
            {/* Глобальный контейнер для уведомлений */}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, minWidth: '250px' }}>
                {notifications.map(({ id, message, variant }) => (
                    <Alert
                        key={id}
                        variant={variant}
                        onClose={() => removeNotification(id)}
                        dismissible
                        style={{ marginBottom: '10px' }}
                    >
                        {message}
                    </Alert>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

// Хук для использования уведомлений
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};