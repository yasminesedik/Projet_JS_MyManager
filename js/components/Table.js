// Reusable Table Component
import { i18n } from '../utils/i18n.js';

export class Table {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            columns: options.columns || [],
            data: options.data || [],
            searchable: options.searchable !== false,
            sortable: options.sortable !== false,
            pagination: options.pagination !== false,
            pageSize: options.pageSize || 10,
            actions: options.actions || [],
            ...options
        };
        this.currentPage = 1;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.filteredData = [...this.options.data];
    }

    render() {
        this.container.innerHTML = `
            <div class="table-container">
                ${this.options.searchable ? this.renderSearch() : ''}
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                ${this.options.columns.map(col => `
                                    <th ${col.sortable !== false ? `class="sortable" data-column="${col.key}"` : ''}>
                                        ${col.label}
                                        ${col.sortable !== false ? '<i class="fas fa-sort ms-1"></i>' : ''}
                                    </th>
                                `).join('')}
                                ${this.options.actions.length > 0 ? `<th data-i18n="common.actions">${i18n.t('common.actions')}</th>` : ''}
                            </tr>
                        </thead>
                        <tbody id="table-body">
                            ${this.renderBody()}
                        </tbody>
                    </table>
                </div>
                ${this.options.pagination ? this.renderPagination() : ''}
            </div>
        `;

        this.attachEventListeners();
    }

    renderSearch() {
        return `
            <div class="mb-3 d-flex justify-content-between align-items-center">
                <input type="text" 
                       id="table-search" 
                       class="form-control" 
                       placeholder="${i18n.t('common.search')}..." 
                       style="max-width: 300px;">
                ${this.options.exportCSV ? `
                    <button class="btn btn-outline-primary" id="export-csv-btn">
                        <i class="fas fa-download"></i> ${i18n.t('common.exportCSV')}
                    </button>
                ` : ''}
            </div>
        `;
    }

    renderBody() {
        const pageData = this.getPageData();
        
        if (pageData.length === 0) {
            return `
                <tr>
                    <td colspan="${this.options.columns.length + (this.options.actions.length > 0 ? 1 : 0)}" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <p>${i18n.t('common.noData')}</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        return pageData.map(row => `
            <tr>
                ${this.options.columns.map(col => `
                    <td>${this.formatCell(row[col.key], col)}</td>
                `).join('')}
                ${this.options.actions.length > 0 ? `
                    <td>
                        <div class="btn-group btn-group-sm">
                            ${this.options.actions.map(action => `
                                <button class="btn btn-${action.type || 'primary'}" 
                                        data-action="${action.name}" 
                                        data-id="${row.id}">
                                    <i class="fas fa-${action.icon || 'eye'}"></i>
                                </button>
                            `).join('')}
                        </div>
                    </td>
                ` : ''}
            </tr>
        `).join('');
    }

    formatCell(value, column) {
        if (column.format) {
            return column.format(value);
        }
        if (column.type === 'date') {
            return new Date(value).toLocaleDateString();
        }
        if (column.type === 'currency') {
            return `$${parseFloat(value).toFixed(2)}`;
        }
        if (column.type === 'badge') {
            return `<span class="badge bg-${column.badgeColor || 'primary'}">${value}</span>`;
        }
        return value || '-';
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);
        
        if (totalPages <= 1) return '';

        return `
            <nav aria-label="Table pagination">
                <ul class="pagination justify-content-center">
                    <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${this.currentPage - 1}">Previous</a>
                    </li>
                    ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
                        <li class="page-item ${page === this.currentPage ? 'active' : ''}">
                            <a class="page-link" href="#" data-page="${page}">${page}</a>
                        </li>
                    `).join('')}
                    <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${this.currentPage + 1}">Next</a>
                    </li>
                </ul>
            </nav>
        `;
    }

    getPageData() {
        const start = (this.currentPage - 1) * this.options.pageSize;
        const end = start + this.options.pageSize;
        return this.filteredData.slice(start, end);
    }

    attachEventListeners() {
        // Search
        const searchInput = this.container.querySelector('#table-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filter(e.target.value);
            });
        }

        // Sort
        this.container.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.column;
                this.sort(column);
            });
        });

        // Pagination
        this.container.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.updateBody();
                }
            });
        });

        // Actions
        this.container.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]').dataset.action;
                const id = e.target.closest('[data-action]').dataset.id;
                if (this.options.onAction) {
                    this.options.onAction(action, id);
                }
            });
        });

        // Export CSV
        const exportBtn = this.container.querySelector('#export-csv-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (this.options.onExportCSV) {
                    this.options.onExportCSV(this.filteredData);
                }
            });
        }
    }

    filter(searchTerm) {
        if (!searchTerm) {
            this.filteredData = [...this.options.data];
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredData = this.options.data.filter(row => {
                return this.options.columns.some(col => {
                    const value = String(row[col.key] || '').toLowerCase();
                    return value.includes(term);
                });
            });
        }
        this.currentPage = 1;
        this.updateBody();
    }

    sort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredData.sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            
            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.updateBody();
        this.updateSortIcons();
    }

    updateSortIcons() {
        this.container.querySelectorAll('.sortable i').forEach(icon => {
            icon.className = 'fas fa-sort ms-1';
        });

        if (this.sortColumn) {
            const th = this.container.querySelector(`[data-column="${this.sortColumn}"]`);
            if (th) {
                const icon = th.querySelector('i');
                icon.className = `fas fa-sort-${this.sortDirection === 'asc' ? 'up' : 'down'} ms-1`;
            }
        }
    }

    updateBody() {
        const tbody = this.container.querySelector('#table-body');
        if (tbody) {
            tbody.innerHTML = this.renderBody();
            this.attachEventListeners();
        }

        const pagination = this.container.querySelector('.pagination');
        if (pagination) {
            pagination.outerHTML = this.renderPagination();
            this.attachEventListeners();
        }
    }

    updateData(newData) {
        this.options.data = newData;
        this.filteredData = [...newData];
        this.currentPage = 1;
        this.render();
    }
}

