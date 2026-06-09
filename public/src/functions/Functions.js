
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

