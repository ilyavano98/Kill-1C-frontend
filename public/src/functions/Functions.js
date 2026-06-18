
export const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    let cleanDateStr = dateStr.split('+')[0].split('[')[0];
    const date = new Date(cleanDateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getDateObject = (dateStr) => {
    if (!dateStr) return null;
    let cleanDateStr = dateStr.split('+')[0].split('[')[0];
    const date = new Date(cleanDateStr);
    if (!isNaN(date.getTime())) return date;
    else return null;
};

// Функция преобразования серверной даты в формат для input
export const toDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    // Удаляем квадратные скобки и все, что внутри них
    const clean = isoString.split('[')[0];
    const date = new Date(clean);
    if (isNaN(date.getTime())) return '';
    // Форматируем без временной зоны, как локальное время пользователя
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};
