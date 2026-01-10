// Client-side Router
import { DashboardView } from '../views/DashboardView.js';
import { GamesView } from '../views/GamesView.js';
import { PlayersView } from '../views/PlayersView.js';
import { PlatformsView } from '../views/PlatformsView.js';
import { GenresView } from '../views/GenresView.js';
import { OrdersView } from '../views/OrdersView.js';
import { Sidebar } from '../components/Sidebar.js';

export class Router {
    constructor() {
        this.routes = {
            '/dashboard': DashboardView,
            '/games': GamesView,
            '/players': PlayersView,
            '/platforms': PlatformsView,
            '/genres': GenresView,
            '/orders': OrdersView
        };
        this.currentView = null;
        this.sidebar = new Sidebar();
    }

    init() {
        // Handle initial route
        this.handleRoute();
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });
        
        // Handle direct navigation
        window.addEventListener('load', () => {
            this.handleRoute();
        });
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/dashboard';
        const [path, query] = hash.split('?');
        
        // Update sidebar active state
        this.sidebar.setActive(path);
        
        // Get view class
        const ViewClass = this.routes[path];
        
        if (ViewClass) {
            // Clean up previous view
            if (this.currentView && this.currentView.destroy) {
                this.currentView.destroy();
            }
            
            // Create new view instance
            const container = document.getElementById('page-content');
            this.currentView = new ViewClass(container, this.parseQuery(query));
            this.currentView.render();
        } else {
            // 404 - redirect to dashboard
            window.location.hash = '/dashboard';
        }
    }

    parseQuery(queryString) {
        if (!queryString) return {};
        const params = {};
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        return params;
    }

    navigate(path) {
        window.location.hash = path;
    }
}

