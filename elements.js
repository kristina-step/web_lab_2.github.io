export function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(key => {
        if (key === 'className') {
            element.className = attributes[key];
        } else if (key === 'dataset') {
            Object.keys(attributes[key]).forEach(dataKey => {
                element.dataset[dataKey] = attributes[key][dataKey];
            });
        } else {
            element[key] = attributes[key];
        }
    });
    return element;
}

export function createButton({ text, className = "", onClick, type = "button" }) {
    const button = createElement('button', {
        className: `btn ${className}`,
        textContent: text,
        type: type
    });
    if (onClick) button.addEventListener('click', onClick);
    return button;
}

export function createInput({ type, className = "", placeholder = "", value = "", id = "" }) {
    return createElement('input', {
        type: type,
        className: `form-input ${className}`,
        placeholder: placeholder,
        value: value,
        id: id
    });
}

export function createSelect({ options, className = "", id = "", onChange }) {
    const select = createElement('select', {
        className: `control-select ${className}`,
        id: id
    });
    
    options.forEach(option => {
        const optionElement = createElement('option', {
            value: option.value,
            textContent: option.text
        });
        select.appendChild(optionElement);
    });
    
    if (onChange) select.addEventListener('change', onChange);
    return select;
}
