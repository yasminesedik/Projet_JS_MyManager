// Platforms View
import { PlatformService } from '../services/PlatformService.js';
import { Table } from '../components/Table.js';
import { Modal } from '../components/Modal.js';
import { ExportUtils } from '../utils/ExportUtils.js';
import { i18n } from '../utils/i18n.js';

export class PlatformsView {
    constructor(container, params = {}) {
        this.container = container;
        this.platformService = new PlatformService();
        this.table = null;
        this.platforms = [];
    }

    async render() {
        await this.loadData();
        
        this.container.innerHTML = `
            <div class="platforms-view">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 data-i18n="platforms.title">${i18n.t('platforms.title')}</h2>
                    <button class="btn btn-primary" id="add-platform-btn">
                        <i class="fas fa-plus"></i> <span data-i18n="platforms.add">${i18n.t('platforms.add')}</span>
                    </button>
                </div>
                <div id="platforms-table-container"></div>
            </div>
        `;

        this.renderTable();
        this.setupEventListeners();
    }

    async loadData() {
        this.platforms = await this.platformService.getAll();
    }

    renderTable() {
        const container = document.getElementById('platforms-table-container');
        this.table = new Table(container, {
            columns: [
                { key: 'name', label: i18n.t('platforms.name'), sortable: true },
                { key: 'company', label: i18n.t('platforms.company'), sortable: true },
                { key: 'releaseYear', label: i18n.t('platforms.releaseYear'), sortable: true }
            ],
            data: this.platforms,
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 10,
            exportCSV: true,
            actions: [
                { name: 'view', icon: 'eye', type: 'info' },
                { name: 'edit', icon: 'edit', type: 'warning' },
                { name: 'delete', icon: 'trash', type: 'danger' }
            ],
            onAction: (action, id) => this.handleAction(action, id),
            onExportCSV: (data) => this.exportCSV(data)
        });
        this.table.render();
    }

    handleAction(action, id) {
        switch (action) {
            case 'view':
                this.viewPlatform(id);
                break;
            case 'edit':
                this.editPlatform(id);
                break;
            case 'delete':
                this.deletePlatform(id);
                break;
        }
    }

    async viewPlatform(id) {
        const platform = await this.platformService.getById(id);
        if (!platform) return;

        const modal = new Modal({
            title: platform.name,
            body: `
                <p><strong>${i18n.t('platforms.company')}:</strong> ${platform.company}</p>
                <p><strong>${i18n.t('platforms.releaseYear')}:</strong> ${platform.releaseYear}</p>
            `,
            footer: `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t('common.cancel')}</button>
                <button type="button" class="btn btn-primary" id="export-pdf-btn">
                    <i class="fas fa-file-pdf"></i> ${i18n.t('common.exportPDF')}
                </button>
            `
        });

        const modalEl = modal.show();
        modalEl.querySelector('#export-pdf-btn').addEventListener('click', () => {
            ExportUtils.exportToPDF(platform, platform.name, `${platform.name.replace(/\s+/g, '_')}.pdf`);
        });
    }

    async editPlatform(id) {
        const platform = await this.platformService.getById(id);
        if (!platform) return;

        this.showPlatformForm(platform);
    }

    showPlatformForm(platform = null) {
        const isEdit = !!platform;
        const modal = new Modal({
            title: isEdit ? i18n.t('common.edit') : i18n.t('platforms.add'),
            body: `
                <form id="platform-form">
                    <div class="mb-3">
                        <label class="form-label">${i18n.t('platforms.name')}</label>
                        <input type="text" class="form-control" id="platform-name" value="${platform?.name || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">${i18n.t('platforms.company')}</label>
                        <input type="text" class="form-control" id="platform-company" value="${platform?.company || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">${i18n.t('platforms.releaseYear')}</label>
                        <input type="number" min="1970" max="2030" class="form-control" id="platform-release-year" value="${platform?.releaseYear || ''}" required>
                    </div>
                </form>
            `,
            footer: `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t('common.cancel')}</button>
                <button type="button" class="btn btn-primary" id="save-platform-btn">${i18n.t('common.save')}</button>
            `
        });

        const modalEl = modal.show();
        modalEl.querySelector('#save-platform-btn').addEventListener('click', () => {
            this.savePlatform(platform?.id, modal);
        });
    }

    async savePlatform(id, modal) {
        const form = document.getElementById('platform-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const platformData = {
            name: document.getElementById('platform-name').value,
            company: document.getElementById('platform-company').value,
            releaseYear: parseInt(document.getElementById('platform-release-year').value)
        };

        try {
            if (id) {
                await this.platformService.update(id, platformData);
            } else {
                await this.platformService.create(platformData);
            }
            modal.hide();
            await this.loadData();
            this.table.updateData(this.platforms);
        } catch (error) {
            alert('Error saving platform: ' + error.message);
        }
    }

    async deletePlatform(id) {
        Modal.confirm(
            i18n.t('common.confirmDelete'),
            async () => {
                try {
                    await this.platformService.delete(id);
                    await this.loadData();
                    this.table.updateData(this.platforms);
                } catch (error) {
                    alert('Error deleting platform: ' + error.message);
                }
            }
        );
    }

    exportCSV(data) {
        ExportUtils.exportToCSV(data, 'platforms.csv');
    }

    setupEventListeners() {
        document.getElementById('add-platform-btn').addEventListener('click', () => {
            this.showPlatformForm();
        });
    }

    destroy() {
        // Cleanup if needed
    }
}

