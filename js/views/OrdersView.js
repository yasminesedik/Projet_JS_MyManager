// Orders View
import { OrderService } from '../services/OrderService.js';
import { PlayerService } from '../services/PlayerService.js';
import { GameService } from '../services/GameService.js';
import { Table } from '../components/Table.js';
import { Modal } from '../components/Modal.js';
import { ExportUtils } from '../utils/ExportUtils.js';
import { i18n } from '../utils/i18n.js';

export class OrdersView {
    constructor(container, params = {}) {
        this.container = container;
        this.orderService = new OrderService();
        this.playerService = new PlayerService();
        this.gameService = new GameService();
        this.table = null;
        this.orders = [];
        this.players = [];
        this.games = [];
    }

    async render() {
        await this.loadData();
        
        this.container.innerHTML = `
            <div class="orders-view">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 data-i18n="orders.title">${i18n.t('orders.title')}</h2>
                    <button class="btn btn-primary" id="add-order-btn">
                        <i class="fas fa-plus"></i> <span data-i18n="orders.add">${i18n.t('orders.add')}</span>
                    </button>
                </div>
                <div id="orders-table-container"></div>
            </div>
        `;

        this.renderTable();
        this.setupEventListeners();
    }

    async loadData() {
        const [orders, players, games] = await Promise.all([
            this.orderService.getAll(),
            this.playerService.getAll(),
            this.gameService.getAll()
        ]);
        this.orders = orders;
        this.players = players;
        this.games = games;
    }

    renderTable() {
        const container = document.getElementById('orders-table-container');
        this.table = new Table(container, {
            columns: [
                { key: 'playerName', label: i18n.t('orders.player'), sortable: true },
                { key: 'gameName', label: i18n.t('orders.game'), sortable: true },
                { key: 'date', label: i18n.t('orders.date'), sortable: true, type: 'date' },
                { key: 'amount', label: i18n.t('orders.amount'), sortable: true, type: 'currency' },
                { key: 'status', label: i18n.t('orders.status'), sortable: true, type: 'badge', badgeColor: 'success' }
            ],
            data: this.orders,
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
                this.viewOrder(id);
                break;
            case 'edit':
                this.editOrder(id);
                break;
            case 'delete':
                this.deleteOrder(id);
                break;
        }
    }

    async viewOrder(id) {
        const order = await this.orderService.getById(id);
        if (!order) return;

        const modal = new Modal({
            title: `Order #${order.id}`,
            body: `
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>${i18n.t('orders.player')}:</strong> ${order.playerName}</p>
                        <p><strong>${i18n.t('orders.game')}:</strong> ${order.gameName}</p>
                        <p><strong>${i18n.t('orders.date')}:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                        <p><strong>${i18n.t('orders.amount')}:</strong> $${order.amount}</p>
                        <p><strong>${i18n.t('orders.status')}:</strong> 
                            <span class="badge bg-${order.status === 'Completed' ? 'success' : 'warning'}">${order.status}</span>
                        </p>
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
            ExportUtils.exportToPDF(order, `Order #${order.id}`, `Order_${order.id}.pdf`);
        });
    }

    async editOrder(id) {
        const order = await this.orderService.getById(id);
        if (!order) return;

        this.showOrderForm(order);
    }

    showOrderForm(order = null) {
        const isEdit = !!order;
        const modal = new Modal({
            title: isEdit ? i18n.t('common.edit') : i18n.t('orders.add'),
            size: 'modal-lg',
            body: `
                <form id="order-form">
                    <div class="mb-3">
                        <label class="form-label">${i18n.t('orders.player')}</label>
                        <select class="form-select" id="order-player" required>
                            <option value="">${i18n.t('common.filter')}...</option>
                            ${this.players.map(p => `
                                <option value="${p.id}" data-name="${p.name}" ${order?.playerId === p.id ? 'selected' : ''}>${p.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">${i18n.t('orders.game')}</label>
                        <select class="form-select" id="order-game" required>
                            <option value="">${i18n.t('common.filter')}...</option>
                            ${this.games.map(g => `
                                <option value="${g.id}" data-name="${g.name}" data-price="${g.price}" ${order?.gameId === g.id ? 'selected' : ''}>${g.name} - $${g.price}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">${i18n.t('orders.date')}</label>
                            <input type="date" class="form-control" id="order-date" value="${order?.date || new Date().toISOString().split('T')[0]}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">${i18n.t('orders.amount')}</label>
                            <input type="number" step="0.01" class="form-control" id="order-amount" value="${order?.amount || ''}" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">${i18n.t('orders.status')}</label>
                        <select class="form-select" id="order-status" required>
                            <option value="Pending" ${order?.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Completed" ${order?.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Cancelled" ${order?.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                </form>
            `,
            footer: `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t('common.cancel')}</button>
                <button type="button" class="btn btn-primary" id="save-order-btn">${i18n.t('common.save')}</button>
            `
        });

        const modalEl = modal.show();
        
        // Auto-fill amount when game is selected
        const gameSelect = modalEl.querySelector('#order-game');
        const amountInput = modalEl.querySelector('#order-amount');
        gameSelect.addEventListener('change', () => {
            const selectedOption = gameSelect.options[gameSelect.selectedIndex];
            if (selectedOption && selectedOption.dataset.price) {
                amountInput.value = selectedOption.dataset.price;
            }
        });

        modalEl.querySelector('#save-order-btn').addEventListener('click', () => {
            this.saveOrder(order?.id, modal);
        });
    }

    async saveOrder(id, modal) {
        const form = document.getElementById('order-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const playerSelect = document.getElementById('order-player');
        const gameSelect = document.getElementById('order-game');
        const playerOption = playerSelect.options[playerSelect.selectedIndex];
        const gameOption = gameSelect.options[gameSelect.selectedIndex];

        const orderData = {
            playerId: parseInt(playerSelect.value),
            playerName: playerOption.dataset.name,
            gameId: parseInt(gameSelect.value),
            gameName: gameOption.dataset.name,
            date: document.getElementById('order-date').value,
            amount: parseFloat(document.getElementById('order-amount').value),
            status: document.getElementById('order-status').value
        };

        try {
            if (id) {
                await this.orderService.update(id, orderData);
            } else {
                await this.orderService.create(orderData);
            }
            modal.hide();
            await this.loadData();
            this.table.updateData(this.orders);
        } catch (error) {
            alert('Error saving order: ' + error.message);
        }
    }

    async deleteOrder(id) {
        Modal.confirm(
            i18n.t('common.confirmDelete'),
            async () => {
                try {
                    await this.orderService.delete(id);
                    await this.loadData();
                    this.table.updateData(this.orders);
                } catch (error) {
                    alert('Error deleting order: ' + error.message);
                }
            }
        );
    }

    exportCSV(data) {
        ExportUtils.exportToCSV(data, 'orders.csv');
    }

    setupEventListeners() {
        document.getElementById('add-order-btn').addEventListener('click', () => {
            this.showOrderForm();
        });
    }

    destroy() {
        // Cleanup if needed
    }
}

