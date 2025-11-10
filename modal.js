import { createElement, createButton } from './elements.js';

export class Modal {
    constructor() {
        this.modal = this.createModal();
        document.body.appendChild(this.modal);
    }

    createModal() {
        const modal = createElement('div', { className: 'modal' });
        const modalContent = createElement('div', { className: 'modal-content' });
        
        modal.appendChild(modalContent);
        return modal;
    }

    show({ title, message, onConfirm, onCancel }) {
        const modalContent = this.modal.querySelector('.modal-content');
        modalContent.innerHTML = '';

        const titleElement = createElement('h3', { textContent: title });
        const messageElement = createElement('p', { textContent: message });
        const actions = createElement('div', { className: 'modal-actions' });

        const confirmBtn = createButton({
            text: 'Да',
            className: 'modal-btn modal-btn-confirm',
            onClick: () => {
                this.hide();
                if (onConfirm) onConfirm();
            }
        });

        const cancelBtn = createButton({
            text: 'Нет',
            className: 'modal-btn modal-btn-cancel',
            onClick: () => {
                this.hide();
                if (onCancel) onCancel();
            }
        });

        actions.appendChild(confirmBtn);
        actions.appendChild(cancelBtn);

        modalContent.appendChild(titleElement);
        modalContent.appendChild(messageElement);
        modalContent.appendChild(actions);

        this.modal.style.display = 'flex';

        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                this.hide();
                if (onCancel) onCancel();
                document.removeEventListener('keydown', handleKeyPress);
            } else if (e.key === 'Enter') {
                this.hide();
                if (onConfirm) onConfirm();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
    }

    hide() {
        this.modal.style.display = 'none';
    }
}
