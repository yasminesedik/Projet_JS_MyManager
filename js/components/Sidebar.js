// Sidebar Component
export class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
    }

    setActive(route) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current route
        const activeItem = document.querySelector(`[data-route="${route.replace('/', '')}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    toggle() {
        this.sidebar.classList.toggle('show');
    }

    hide() {
        this.sidebar.classList.remove('show');
    }
}

