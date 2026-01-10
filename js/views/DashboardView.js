// Dashboard View
import { GameService } from '../services/GameService.js';
import { PlayerService } from '../services/PlayerService.js';
import { PlatformService } from '../services/PlatformService.js';
import { OrderService } from '../services/OrderService.js';
import { GenreService } from '../services/GenreService.js';
import { i18n } from '../utils/i18n.js';

export class DashboardView {
    constructor(container, params = {}) {
        this.container = container;
        this.gameService = new GameService();
        this.playerService = new PlayerService();
        this.platformService = new PlatformService();
        this.orderService = new OrderService();
        this.genreService = new GenreService();
        this.charts = {};
    }

    async render() {
        this.container.innerHTML = `
            <div class="dashboard">
                <h2 class="mb-4" data-i18n="dashboard.title">${i18n.t('dashboard.title')}</h2>
                
                <!-- KPI Cards -->
                <div class="row mb-4" id="kpi-cards">
                    <div class="col-md-3 col-sm-6 mb-3">
                        <div class="kpi-card">
                            <div class="kpi-icon"><i class="fas fa-gamepad"></i></div>
                            <div class="kpi-label" data-i18n="dashboard.totalGames">${i18n.t('dashboard.totalGames')}</div>
                            <div class="kpi-value" id="total-games">-</div>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6 mb-3">
                        <div class="kpi-card">
                            <div class="kpi-icon"><i class="fas fa-users"></i></div>
                            <div class="kpi-label" data-i18n="dashboard.totalPlayers">${i18n.t('dashboard.totalPlayers')}</div>
                            <div class="kpi-value" id="total-players">-</div>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6 mb-3">
                        <div class="kpi-card">
                            <div class="kpi-icon"><i class="fas fa-desktop"></i></div>
                            <div class="kpi-label" data-i18n="dashboard.totalPlatforms">${i18n.t('dashboard.totalPlatforms')}</div>
                            <div class="kpi-value" id="total-platforms">-</div>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6 mb-3">
                        <div class="kpi-card">
                            <div class="kpi-icon"><i class="fas fa-shopping-cart"></i></div>
                            <div class="kpi-label" data-i18n="dashboard.totalOrders">${i18n.t('dashboard.totalOrders')}</div>
                            <div class="kpi-value" id="total-orders">-</div>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-6 mb-3">
                        <div class="kpi-card">
                            <div class="kpi-icon"><i class="fas fa-dollar-sign"></i></div>
                            <div class="kpi-label" data-i18n="dashboard.totalRevenue">${i18n.t('dashboard.totalRevenue')}</div>
                            <div class="kpi-value" id="total-revenue">-</div>
                        </div>
                    </div>
                </div>

                <!-- Charts Row 1 -->
                <div class="row mb-4">
                    <div class="col-md-6 mb-3">
                        <div class="chart-container">
                            <h5 data-i18n="dashboard.gamesPerGenre">${i18n.t('dashboard.gamesPerGenre')}</h5>
                            <canvas id="chart-genres"></canvas>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="chart-container">
                            <h5 data-i18n="dashboard.gamesPerPlatform">${i18n.t('dashboard.gamesPerPlatform')}</h5>
                            <canvas id="chart-platforms"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Charts Row 2 -->
                <div class="row mb-4">
                    <div class="col-md-6 mb-3">
                        <div class="chart-container">
                            <h5 data-i18n="dashboard.ordersOverTime">${i18n.t('dashboard.ordersOverTime')}</h5>
                            <canvas id="chart-orders"></canvas>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="chart-container">
                            <h5 data-i18n="dashboard.topGames">${i18n.t('dashboard.topGames')}</h5>
                            <canvas id="chart-top-games"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Charts Row 3 -->
                <div class="row">
                    <div class="col-md-12">
                        <div class="chart-container">
                            <h5 data-i18n="dashboard.playerActivity">${i18n.t('dashboard.playerActivity')}</h5>
                            <canvas id="chart-player-activity"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;

        await this.loadData();
        this.renderCharts();
    }

    async loadData() {
        try {
            const [games, players, platforms, orders, genres] = await Promise.all([
                this.gameService.getAll(),
                this.playerService.getAll(),
                this.platformService.getAll(),
                this.orderService.getAll(),
                this.genreService.getAll()
            ]);

            this.games = games;
            this.players = players;
            this.platforms = platforms;
            this.orders = orders;
            this.genres = genres;

            // Update KPIs
            document.getElementById('total-games').textContent = games.length;
            document.getElementById('total-players').textContent = players.length;
            document.getElementById('total-platforms').textContent = platforms.length;
            document.getElementById('total-orders').textContent = orders.length;
            
            const totalRevenue = orders
                .filter(o => o.status === 'Completed')
                .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);
            document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    renderCharts() {
        // Games per Genre (Bar Chart)
        const genreCounts = {};
        this.games.forEach(game => {
            genreCounts[game.genre] = (genreCounts[game.genre] || 0) + 1;
        });

        const genreCtx = document.getElementById('chart-genres');
        if (genreCtx) {
            const gradient = genreCtx.getContext('2d').createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0.8)');
            
            this.charts.genres = new Chart(genreCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(genreCounts),
                    datasets: [{
                        label: 'Games',
                        data: Object.values(genreCounts),
                        backgroundColor: gradient,
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                font: {
                                    weight: 'bold'
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                }
            });
        }

        // Games per Platform (Pie Chart)
        const platformCounts = {};
        this.games.forEach(game => {
            platformCounts[game.platform] = (platformCounts[game.platform] || 0) + 1;
        });

        const platformCtx = document.getElementById('chart-platforms');
        if (platformCtx) {
            this.charts.platforms = new Chart(platformCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(platformCounts),
                    datasets: [{
                        data: Object.values(platformCounts),
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(236, 72, 153, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(239, 68, 68, 0.8)'
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 3,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                }
            });
        }

        // Orders Over Time (Line Chart)
        const ordersByDate = {};
        this.orders.forEach(order => {
            const date = order.date;
            ordersByDate[date] = (ordersByDate[date] || 0) + 1;
        });

        const sortedDates = Object.keys(ordersByDate).sort();
        const orderCtx = document.getElementById('chart-orders');
        if (orderCtx) {
            const gradient = orderCtx.getContext('2d').createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
            
            this.charts.orders = new Chart(orderCtx, {
                type: 'line',
                data: {
                    labels: sortedDates,
                    datasets: [{
                        label: 'Orders',
                        data: sortedDates.map(date => ordersByDate[date]),
                        borderColor: 'rgba(99, 102, 241, 1)',
                        backgroundColor: gradient,
                        tension: 0.5,
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: 'rgba(99, 102, 241, 1)',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                font: {
                                    weight: 'bold'
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                }
            });
        }

        // Top Games by Sales (Bar Chart)
        const gameSales = {};
        this.orders.forEach(order => {
            if (order.status === 'Completed') {
                gameSales[order.gameName] = (gameSales[order.gameName] || 0) + 1;
            }
        });

        const sortedGames = Object.entries(gameSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const topGamesCtx = document.getElementById('chart-top-games');
        if (topGamesCtx) {
            const gradient = topGamesCtx.getContext('2d').createLinearGradient(0, 0, 400, 0);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
            gradient.addColorStop(1, 'rgba(5, 150, 105, 0.8)');
            
            this.charts.topGames = new Chart(topGamesCtx, {
                type: 'bar',
                data: {
                    labels: sortedGames.map(([name]) => name),
                    datasets: [{
                        label: 'Sales',
                        data: sortedGames.map(([, count]) => count),
                        backgroundColor: gradient,
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                font: {
                                    weight: 'bold'
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        y: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                }
            });
        }

        // Player Activity (Scatter/Line Chart)
        const playerActivity = {};
        this.orders.forEach(order => {
            const player = order.playerName;
            playerActivity[player] = (playerActivity[player] || 0) + 1;
        });

        const activityCtx = document.getElementById('chart-player-activity');
        if (activityCtx) {
            const gradient = activityCtx.getContext('2d').createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(236, 72, 153, 0.3)');
            gradient.addColorStop(1, 'rgba(236, 72, 153, 0.05)');
            
            this.charts.activity = new Chart(activityCtx, {
                type: 'line',
                data: {
                    labels: Object.keys(playerActivity),
                    datasets: [{
                        label: 'Orders per Player',
                        data: Object.values(playerActivity),
                        borderColor: 'rgba(236, 72, 153, 1)',
                        backgroundColor: gradient,
                        tension: 0.5,
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: 'rgba(236, 72, 153, 1)',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                font: {
                                    weight: 'bold'
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    destroy() {
        // Destroy all charts
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

