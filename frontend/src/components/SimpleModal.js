import React from "react";

export function SimpleModal({
                                modalId = "clientModal",
                                modalTitle = "Новый клиент",
                                fields = [
                                    {
                                        id: "clientName",
                                        type: "text",
                                        placeholder: "ФИО / Компания",
                                        required: true,
                                        className: "form-control mb-2"
                                    },
                                    {
                                        id: "clientPhone",
                                        type: "tel",
                                        placeholder: "Телефон",
                                        className: "form-control mb-2"
                                    },
                                    {
                                        id: "clientEmail",
                                        type: "email",
                                        placeholder: "Email (необязательно)",
                                        className: "form-control mb-2"
                                    },
                                    {
                                        id: "clientPreferences",
                                        type: "textarea",
                                        placeholder: "Предпочтения",
                                        rows: 2,
                                        className: "form-control"
                                    }
                                ],
                                hiddenFields = [
                                    { id: "clientId", type: "hidden" }
                                ],
                                cancelText = "Отмена",
                                saveText = "Сохранить",
                                cancelButtonClass = "btn btn-secondary",
                                saveButtonClass = "btn btn-primary",
                                saveButtonId = "saveClientBtn",
                                modalSize = "modal-dialog-centered"
                            }) {
    return (
        <>
            <div className="modal fade" id={modalId} tabIndex="-1">
                <div className={`modal-dialog ${modalSize}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={`${modalId}Title`}>
                                {modalTitle}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body">
                            {/* Скрытые поля */}
                            {hiddenFields.map((field, index) => (
                                <input
                                    key={index}
                                    type={field.type}
                                    id={field.id}
                                    {...(field.name && { name: field.name })}
                                    {...(field.value && { value: field.value })}
                                />
                            ))}

                            {/* Основные поля формы */}
                            {fields.map((field, index) => {
                                if (field.type === "textarea") {
                                    return (
                                        <textarea
                                            key={index}
                                            id={field.id}
                                            className={field.className || "form-control mb-2"}
                                            placeholder={field.placeholder}
                                            required={field.required || false}
                                            rows={field.rows || 2}
                                            {...(field.name && { name: field.name })}
                                            {...(field.value && { value: field.value })}
                                            {...(field.onChange && { onChange: field.onChange })}
                                        />
                                    );
                                }

                                // Обработка select с опциями
                                if (field.type === "select") {
                                    return (
                                        <select
                                            key={index}
                                            id={field.id}
                                            className={field.className || "form-control mb-2"}
                                            required={field.required || false}
                                            {...(field.name && { name: field.name })}
                                            {...(field.value && { value: field.value })}
                                            {...(field.onChange && { onChange: field.onChange })}
                                        >
                                            {/* Опция по умолчанию */}
                                            {field.placeholder && (
                                                <option value="" disabled>
                                                    {field.placeholder}
                                                </option>
                                            )}

                                            {/* Динамические опции */}
                                            {field.options && field.options.map((option, optIndex) => (
                                                <option
                                                    key={optIndex}
                                                    value={option.value}
                                                >
                                                    {option.label || option.value}
                                                </option>
                                            ))}

                                            {/* Статические опции через children */}
                                            {field.children}
                                        </select>
                                    );
                                }

                                if (field.type === "number") {
                                    return (
                                        <input
                                            key={index}
                                            type={"number"}
                                            id={field.id}
                                            min={field.min}
                                            className={field.className || "form-control mb-2"}
                                            required={field.required || false}
                                            {...(field.name && { name: field.name })}
                                            {...(field.value && { value: field.value })}
                                            {...(field.onChange && { onChange: field.onChange })}
                                        />
                                    );
                                }

                                return (
                                    <input
                                        key={index}
                                        type={field.type || "text"}
                                        id={field.id}
                                        className={field.className || "form-control mb-2"}
                                        placeholder={field.placeholder}
                                        required={field.required || false}
                                        {...(field.name && { name: field.name })}
                                        {...(field.value && { value: field.value })}
                                        {...(field.onChange && { onChange: field.onChange })}
                                    />
                                );
                            })}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className={cancelButtonClass}
                                data-bs-dismiss="modal"
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                className={saveButtonClass}
                                id={saveButtonId}
                            >
                                {saveText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}