// Players View
import { PlayerService } from '../services/PlayerService.js';
import { GenreService } from '../services/GenreService.js';
import { Table } from '../components/Table.js';
import { Modal } from '../components/Modal.js';
import { ExportUtils } from '../utils/ExportUtils.js';
import { i18n } from '../utils/i18n.js';

export class PlayersView {
    constructor(container, params = {}) {
        this.container = container;
        this.playerService = new PlayerService();
        this.genreService = new GenreService();
        this.table = null;
        this.players = [];
        this.genres = [];
    }

    async render() {
        await this.loadData();
        
        this.container.innerHTML = `
            <div class="players-view">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 data-i18n="players.title">${i18n.t('players.title')}</h2>
                    <button class="btn btn-primary" id="add-player-btn">
                        <i class="fas fa-plus"></i> <span data-i18n="players.add">${i18n.t('players.add')}</span>
                    </button>
                </div>
                <div id="players-table-container"></div>
            </div>
        `;

        this.renderTable();
        this.setupEventListeners();
    }

    async loadData() {
        const [players, genres] = await Promise.all([
            this.playerService.getAll(),
            this.genreService.getAll()
        ]);
        this.players = players;
        this.genres = genres;
    }

    renderTable() {
        const container = document.getElementById('players-table-container');
        this.table = new Table(container, {
            columns: [
                { key: 'name', label: i18n.t('players.name'), sortable: true },
                { key: 'email', label: i18n.t('players.email'), sortable: true },
                { key: 'age', label: i18n.t('players.age'), sortable: true },
                { key: 'country', label: i18n.t('players.country'), sortable: true },
                { key: 'favoriteGenre', label: i18n.t('players.favoriteGenre'), sortable: true }
            ],
            data: this.players,
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
                this.viewPlayer(id);
                break;
            case 'edit':
                this.editPlayer(id);
                break;
            case 'delete':
                this.deletePlayer(id);
                break;
        }
    }

    async viewPlayer(id) {
        const player = await this.playerService.getById(id);
        if (!player) return;

        const modal = new Modal({
            title: player.name,
            size: 'modal-lg',
            body: `
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>${i18n.t('players.email')}:</strong> ${player.email}</p>
                        <p><strong>${i18n.t('players.age')}:</strong> ${player.age}</p>
                        <p><strong>${i18n.t('players.country')}:</strong> ${player.country}</p>
                        <p><strong>${i18n.t('players.favoriteGenre')}:</strong> ${player.favoriteGenre}</p>
                    </div>
                </div>
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
            ExportUtils.exportToPDF(player, player.name, `${player.name.replace(/\s+/g, '_')}.pdf`);
        });
    }

    async editPlayer(id) {
        const player = await this.playerService.getById(id);
        if (!player) return;

        this.showPlayerForm(player);
    }

    showPlayerForm(player = null) {
        const isEdit = !!player;
        const modal = new Modal({
            title: isEdit ? i18n.t('common.edit') : i18n.t('players.add'),
            size: 'modal-lg',
            body: `
                <form id="player-form">
                    <div class="mb-3">
                        <label class="form-label">${i18n.t('players.name')}</label>
                        <input type="text" class="form-control" id="player-name" value="${player?.name || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">${i18n.t('players.email')}</label>
                        <input type="email" class="form-control" id="player-email" value="${player?.email || ''}" required>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">${i18n.t('players.age')}</label>
                            <input type="number" min="1" class="form-control" id="player-age" value="${player?.age || ''}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">${i18n.t('players.country')}</label>
                            <input type="text" class="form-control" id="player-country" value="${player?.country || ''}" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">${i18n.t('players.favoriteGenre')}</label>
                        <select class="form-select" id="player-favorite-genre" required>
                            <option value="">${i18n.t('common.filter')}...</option>
                            ${this.genres.map(g => `
                                <option value="${g.name}" ${player?.favoriteGenre === g.name ? 'selected' : ''}>${g.name}</option>
                            `).join('')}
                        </select>
                    </div>
                </form>
            `,
            footer: `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t('common.cancel')}</button>
                <button type="button" class="btn btn-primary" id="save-player-btn">${i18n.t('common.save')}</button>
            `
        });

        const modalEl = modal.show();
        modalEl.querySelector('#save-player-btn').addEventListener('click', () => {
            this.savePlayer(player?.id, modal);
        });
    }

    async savePlayer(id, modal) {
        const form = document.getElementById('player-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const playerData = {
            name: document.getElementById('player-name').value,
            email: document.getElementById('player-email').value,
            age: parseInt(document.getElementById('player-age').value),
            country: document.getElementById('player-country').value,
            favoriteGenre: document.getElementById('player-favorite-genre').value
        };

        try {
            if (id) {
                await this.playerService.update(id, playerData);
            } else {
                await this.playerService.create(playerData);
            }
            modal.hide();
            await this.loadData();
            this.table.updateData(this.players);
        } catch (error) {
            alert('Error saving player: ' + error.message);
        }
    }

    async deletePlayer(id) {
        Modal.confirm(
            i18n.t('common.confirmDelete'),
            async () => {
                try {
                    await this.playerService.delete(id);
                    await this.loadData();
                    this.table.updateData(this.players);
                } catch (error) {
                    alert('Error deleting player: ' + error.message);
                }
            }
        );
    }

    exportCSV(data) {
        ExportUtils.exportToCSV(data, 'players.csv');
    }

    setupEventListeners() {
        document.getElementById('add-player-btn').addEventListener('click', () => {
            this.showPlayerForm();
        });
    }

    destroy() {
        // Cleanup if needed
    }
}

