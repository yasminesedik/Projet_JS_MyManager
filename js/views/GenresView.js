// Genres View
import { GenreService } from '../services/GenreService.js';
import { Table } from '../components/Table.js';
import { Modal } from '../components/Modal.js';
import { ExportUtils } from '../utils/ExportUtils.js';
import { i18n } from '../utils/i18n.js';

export class GenresView {
    constructor(container, params = {}) {
        this.container = container;
        this.genreService = new GenreService();
        this.table = null;
        this.genres = [];
    }

    async render() {
        await this.loadData();
        
        this.container.innerHTML = `
            <div class="genres-view">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 data-i18n="genres.title">${i18n.t('genres.title')}</h2>
                    <button class="btn btn-primary" id="add-genre-btn">
                        <i class="fas fa-plus"></i> <span data-i18n="genres.add">${i18n.t('genres.add')}</span>
                    </button>
                </div>
                <div id="genres-table-container"></div>
            </div>
        `;

        this.renderTable();
        this.setupEventListeners();
    }

    async loadData() {
        this.genres = await this.genreService.getAll();
    }

    renderTable() {
        const container = document.getElementById('genres-table-container');
        this.table = new Table(container, {
            columns: [
                { key: 'name', label: i18n.t('genres.name'), sortable: true },
                { key: 'description', label: i18n.t('genres.description'), sortable: true }
            ],
            data: this.genres,
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
                this.viewGenre(id);
                break;
            case 'edit':
                this.editGenre(id);
                break;
            case 'delete':
                this.deleteGenre(id);
                break;
        }
    }

    async viewGenre(id) {
        const genre = await this.genreService.getById(id);
        if (!genre) return;

        const modal = new Modal({
            title: genre.name,
            body: `
                <p><strong>${i18n.t('genres.description')}:</strong> ${genre.description}</p>
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
            ExportUtils.exportToPDF(genre, genre.name, `${genre.name.replace(/\s+/g, '_')}.pdf`);
        });
    }

    async editGenre(id) {
        const genre = await this.genreService.getById(id);
        if (!genre) return;

        this.showGenreForm(genre);
    }

    showGenreForm(genre = null) {
        const isEdit = !!genre;
        const modal = new Modal({
            title: isEdit ? i18n.t('common.edit') : i18n.t('genres.add'),
            body: `
                <form id="genre-form">
                    <div class="mb-3">
                        <label class="form-label">${i18n.t('genres.name')}</label>
                        <input type="text" class="form-control" id="genre-name" value="${genre?.name || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">${i18n.t('genres.description')}</label>
                        <textarea class="form-control" id="genre-description" rows="3">${genre?.description || ''}</textarea>
                    </div>
                </form>
            `,
            footer: `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t('common.cancel')}</button>
                <button type="button" class="btn btn-primary" id="save-genre-btn">${i18n.t('common.save')}</button>
            `
        });

        const modalEl = modal.show();
        modalEl.querySelector('#save-genre-btn').addEventListener('click', () => {
            this.saveGenre(genre?.id, modal);
        });
    }

    async saveGenre(id, modal) {
        const form = document.getElementById('genre-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const genreData = {
            name: document.getElementById('genre-name').value,
            description: document.getElementById('genre-description').value
        };

        try {
            if (id) {
                await this.genreService.update(id, genreData);
            } else {
                await this.genreService.create(genreData);
            }
            modal.hide();
            await this.loadData();
            this.table.updateData(this.genres);
        } catch (error) {
            alert('Error saving genre: ' + error.message);
        }
    }

    async deleteGenre(id) {
        Modal.confirm(
            i18n.t('common.confirmDelete'),
            async () => {
                try {
                    await this.genreService.delete(id);
                    await this.loadData();
                    this.table.updateData(this.genres);
                } catch (error) {
                    alert('Error deleting genre: ' + error.message);
                }
            }
        );
    }

    exportCSV(data) {
        ExportUtils.exportToCSV(data, 'genres.csv');
    }

    setupEventListeners() {
        document.getElementById('add-genre-btn').addEventListener('click', () => {
            this.showGenreForm();
        });
    }

    destroy() {
        // Cleanup if needed
    }
}

