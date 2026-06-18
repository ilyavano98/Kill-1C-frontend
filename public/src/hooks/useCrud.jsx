import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../components/NotificationProvider';

/**
 * Универсальный хук для управления CRUD-операциями с сущностью
 * @param {Object} config
 * @param {Function} config.getItems - функция получения списка (async)
 * @param {Function} config.createItem - функция создания (async)
 * @param {Function} config.updateItem - функция обновления (async)
 * @param {Function} config.deleteItem - функция удаления (async)
 * @param {Object} config.initialForm - начальное состояние формы
 * @param {string} config.entityName - название сущности для уведомлений (например, 'Запись')
 * @param {Function} config.transformPayload - опциональная трансформация данных перед отправкой (например, преобразование типов)
 * @param {Function} config.transformItemForEdit - опциональная трансформация данных сущности для заполнения формы (если поля отличаются от формы)
 * @returns {Object} { items, loading, form, setForm, show, setShow, editing, setEditing, load, save, del, openEdit, addButtonProps }
 */
export const useCrud = ({
                            getItems,
                            createItem,
                            updateItem,
                            deleteItem,
                            initialForm,
                            entityName = 'Запись',
                            transformPayload = (data) => data,
                            transformItemForEdit = (item) => item,
                        }) => {
    const { addNotification } = useNotification();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(initialForm);

    // Загрузка данных
    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getItems();
            setItems(Array.isArray(data) ? data : data?.data || []);
        } catch (e) {
            console.error('LOAD ERROR:', e);
            addNotification(`Ошибка загрузки ${entityName.toLowerCase()}`, 'danger');
        } finally {
            setLoading(false);
        }
    }, [getItems, addNotification, entityName]);

    useEffect(() => {
        load();
    }, [load]);

    // Сохранение (создание или обновление)
    const save = useCallback(async () => {
        setLoading(true);
        try {
            const payload = transformPayload(form);
            if (editing) {
                await updateItem(editing.id, payload);
                addNotification(`${entityName} успешно обновлена`, 'success');
            } else {
                await createItem(payload);
                addNotification(`${entityName} успешно добавлена`, 'success');
            }
            setShow(false);
            setEditing(null);
            setForm(initialForm);
            await load();
        } catch (e) {
            console.error('SAVE ERROR:', e);
            addNotification(`Ошибка при сохранении ${entityName.toLowerCase()}`, 'danger');
        } finally {
            setLoading(false);
        }
    }, [form, editing, createItem, updateItem, load, addNotification, entityName, transformPayload, initialForm]);

    // Удаление
    const del = useCallback(async (id) => {
        if (!window.confirm(`Удалить ${entityName.toLowerCase()}?`)) return;
        setLoading(true);
        try {
            await deleteItem(id);
            addNotification(`${entityName} удалена`, 'success');
            await load();
        } catch (e) {
            console.error('DELETE ERROR:', e);
            addNotification(`Ошибка при удалении ${entityName.toLowerCase()}`, 'danger');
        } finally {
            setLoading(false);
        }
    }, [deleteItem, load, addNotification, entityName]);

    // Открыть редактирование
    const openEdit = useCallback((item) => {
        setEditing(item);
        // Трансформируем данные сущности в формат формы
        const transformed = transformItemForEdit(item);
        setForm({ ...initialForm, ...transformed });
        setShow(true);
    }, [transformItemForEdit, initialForm]);

    // Открыть добавление
    const openAdd = useCallback(() => {
        setEditing(null);
        setForm(initialForm);
        setShow(true);
    }, [initialForm]);

    return {
        items,
        loading,
        form,
        setForm,
        show,
        setShow,
        editing,
        setEditing,
        load,
        save,
        del,
        openEdit,
        openAdd,
    };
};