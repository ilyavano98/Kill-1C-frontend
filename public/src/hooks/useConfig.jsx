import { useDispatch, useSelector } from 'react-redux';
import {
    startEditing,
    cancelEditing,
    updateDraft,
    resetToDefault,
    localSave,
    saveConfigs,
    loadConfig,
} from '../features/config/configSlice';

export const useConfig = () => {
    const dispatch = useDispatch();
    const config = useSelector((state) => state.config.config);
    const draft = useSelector((state) => state.config.draftConfig);
    const isEditing = useSelector((state) => state.config.isEditing);
    const loading = useSelector((state) => state.config.loading);
    const error = useSelector((state) => state.config.error);

    // Войти в режим редактирования
    const enterEditMode = () => dispatch(startEditing());

    // Выйти без сохранения
    const cancelEdit = () => dispatch(cancelEditing());

    // Обновить черновик (для компонентов)
    const setDraftValue = (path, value) => {
        // Создаём полностью независимую копию черновика
        const newDraft = JSON.parse(JSON.stringify(draft));
        const parts = path.split('.');
        let current = newDraft;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {};
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        dispatch(updateDraft(newDraft));
    };

    // Сохранить (отправить на бэкенд)
    const saveConfig = () => dispatch(saveConfigs(draft));

    // Локальное сохранение (без бэка) — для тестирования
    const localSaveOnly = () => dispatch(localSave());

    // Загрузить конфиг с бэка
    const load = () => dispatch(loadConfig());

    // Сброс к дефолту
    const reset = () => dispatch(resetToDefault());

    return {
        config,
        draft,
        isEditing,
        loading,
        error,
        enterEditMode,
        cancelEdit,
        setDraftValue,
        saveConfig,
        localSaveOnly,
        load,
        reset,
    };
};

// Хук для чтения конкретного значения (из опубликованной конфигурации)
export const useConfigValue = (path, defaultValue) => {
    const { config, setDraftValue } = useConfig();
    const value = path.split('.').reduce((obj, key) => obj?.[key], config) ?? defaultValue;
    return value;
};

// Хук для чтения значения из черновика (во время редактирования)
export const useDraftValue = (path, defaultValue) => {
    const { draft, setDraftValue } = useConfig();
    const value = path.split('.').reduce((obj, key) => obj?.[key], draft) ?? defaultValue;
    const setValue = (newVal) => setDraftValue(path, newVal);
    return [value, setValue];
};