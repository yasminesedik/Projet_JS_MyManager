// Reusable Modal Component
import { i18n } from '../utils/i18n.js';

export class Modal {
    constructor(options = {}) {
        this.options = {
            title: options.title || 'Modal',
            body: options.body || '',
            footer: options.footer || null,
            size: options.size || 'modal-lg',
            onClose: options.onClose || null,
            ...options
        };
        this.modal = null;
        this.bootstrapModal = null;
    }

    show() {
        const modalId = `modal-${Date.now()}`;
        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1">
                <div class="modal-dialog ${this.options.size}">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${this.options.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            ${this.options.body}
                        </div>
                        ${this.options.footer ? `
                            <div class="modal-footer">
                                ${this.options.footer}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        // Remove existing modals
        document.querySelectorAll('.modal').forEach(m => {
            if (m.id !== modalId) {
                const bsModal = bootstrap.Modal.getInstance(m);
                if (bsModal) bsModal.dispose();
                m.remove();
            }
        });

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById(modalId);
        this.bootstrapModal = new bootstrap.Modal(this.modal);

        this.modal.addEventListener('hidden.bs.modal', () => {
            if (this.options.onClose) {
                this.options.onClose();
            }
            this.modal.remove();
        });

        this.bootstrapModal.show();
        return this.modal;
    }

    hide() {
        if (this.bootstrapModal) {
            this.bootstrapModal.hide();
        }
    }

    updateBody(html) {
        if (this.modal) {
            const body = this.modal.querySelector('.modal-body');
            if (body) {
                body.innerHTML = html;
            }
        }
    }

    static confirm(message, onConfirm, onCancel) {
        const modal = new Modal({
            title: i18n.t('common.confirm'),
            body: `<p>${message}</p>`,
            footer: `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t('common.cancel')}</button>
                <button type="button" class="btn btn-danger" id="confirm-btn">${i18n.t('common.confirm')}</button>
            `,
            size: ''
        });

        const modalEl = modal.show();
        modalEl.querySelector('#confirm-btn').addEventListener('click', () => {
            if (onConfirm) onConfirm();
            modal.hide();
        });

        if (onCancel) {
            modal.modal.addEventListener('hidden.bs.modal', onCancel);
        }

        return modal;
    }
}

