import React from 'react';
import { createRoot } from 'react-dom/client';
import WidgetApp from './WidgetApp';

(function initWidget() {
    // Получаем параметры из скрипта
    const scripts = document.getElementsByTagName('script');
    let scriptSrc = '';
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.includes('widget.js')) {
            scriptSrc = scripts[i].src;
            break;
        }
    }

    if (!scriptSrc) {
        console.error('Widget script not found');
        return;
    }

    // Парсим параметры из URL
    const urlParams = new URLSearchParams(scriptSrc.split('?')[1] || '');
    const widgetId = urlParams.get('id');
    if (!widgetId) {
        console.error('Widget ID not provided');
        return;
    }

    // Создаём контейнер для виджета
    const container = document.createElement('div');
    container.id = 'crm-widget-root';
    document.body.appendChild(container);

    // Рендерим виджет
    const root = createRoot(container);
    root.render(<WidgetApp widgetId={widgetId} />);
})();