// Order Service
export class OrderService {
    constructor() {
        this.storageKey = 'mymanager_orders';
        this.initData();
    }

    initData() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultOrders = [
                { id: 1, playerId: 1, playerName: 'John Doe', gameId: 1, gameName: 'The Witcher 3', date: '2024-01-15', amount: 29.99, status: 'Completed' },
                { id: 2, playerId: 2, playerName: 'Jane Smith', gameId: 3, gameName: 'God of War', date: '2024-01-16', amount: 39.99, status: 'Completed' },
                { id: 3, playerId: 3, playerName: 'Ahmed Al-Mansouri', gameId: 8, gameName: 'Forza Horizon 5', date: '2024-01-17', amount: 59.99, status: 'Pending' },
                { id: 4, playerId: 4, playerName: 'Marie Dubois', gameId: 6, gameName: 'Elden Ring', date: '2024-01-18', amount: 59.99, status: 'Completed' },
                { id: 5, playerId: 5, playerName: 'Carlos Rodriguez', gameId: 4, gameName: 'Halo Infinite', date: '2024-01-19', amount: 59.99, status: 'Completed' },
                { id: 6, playerId: 6, playerName: 'Yuki Tanaka', gameId: 5, gameName: 'Mario Odyssey', date: '2024-01-20', amount: 59.99, status: 'Completed' },
                { id: 7, playerId: 7, playerName: 'Emma Wilson', gameId: 7, gameName: 'Horizon Zero Dawn', date: '2024-01-21', amount: 19.99, status: 'Pending' },
                { id: 8, playerId: 8, playerName: 'Mohammed Hassan', gameId: 2, gameName: 'Cyberpunk 2077', date: '2024-01-22', amount: 49.99, status: 'Completed' },
                { id: 9, playerId: 1, playerName: 'John Doe', gameId: 6, gameName: 'Elden Ring', date: '2024-01-23', amount: 59.99, status: 'Completed' },
                { id: 10, playerId: 2, playerName: 'Jane Smith', gameId: 1, gameName: 'The Witcher 3', date: '2024-01-24', amount: 29.99, status: 'Completed' }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(defaultOrders));
        }
    }

    getAll() {
        const orders = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        return Promise.resolve(orders);
    }

    getById(id) {
        const orders = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const order = orders.find(o => o.id === parseInt(id));
        return Promise.resolve(order || null);
    }

    create(order) {
        const orders = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
        const newOrder = { ...order, id: newId };
        orders.push(newOrder);
        localStorage.setItem(this.storageKey, JSON.stringify(orders));
        return Promise.resolve(newOrder);
    }

    update(id, order) {
        const orders = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const index = orders.findIndex(o => o.id === parseInt(id));
        if (index !== -1) {
            orders[index] = { ...order, id: parseInt(id) };
            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            return Promise.resolve(orders[index]);
        }
        return Promise.reject(new Error('Order not found'));
    }

    delete(id) {
        const orders = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const filtered = orders.filter(o => o.id !== parseInt(id));
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        return Promise.resolve(true);
    }
}

