// Player Service
export class PlayerService {
    constructor() {
        this.storageKey = 'mymanager_players';
        this.initData();
    }

    initData() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultPlayers = [
                { id: 1, name: 'John Doe', email: 'john@example.com', age: 25, country: 'USA', favoriteGenre: 'RPG' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 28, country: 'UK', favoriteGenre: 'Action' },
                { id: 3, name: 'Ahmed Al-Mansouri', email: 'ahmed@example.com', age: 22, country: 'UAE', favoriteGenre: 'Racing' },
                { id: 4, name: 'Marie Dubois', email: 'marie@example.com', age: 30, country: 'France', favoriteGenre: 'RPG' },
                { id: 5, name: 'Carlos Rodriguez', email: 'carlos@example.com', age: 27, country: 'Spain', favoriteGenre: 'FPS' },
                { id: 6, name: 'Yuki Tanaka', email: 'yuki@example.com', age: 24, country: 'Japan', favoriteGenre: 'Platform' },
                { id: 7, name: 'Emma Wilson', email: 'emma@example.com', age: 26, country: 'Canada', favoriteGenre: 'Action' },
                { id: 8, name: 'Mohammed Hassan', email: 'mohammed@example.com', age: 29, country: 'Morocco', favoriteGenre: 'RPG' }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(defaultPlayers));
        }
    }

    getAll() {
        const players = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        return Promise.resolve(players);
    }

    getById(id) {
        const players = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const player = players.find(p => p.id === parseInt(id));
        return Promise.resolve(player || null);
    }

    create(player) {
        const players = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const newId = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
        const newPlayer = { ...player, id: newId };
        players.push(newPlayer);
        localStorage.setItem(this.storageKey, JSON.stringify(players));
        return Promise.resolve(newPlayer);
    }

    update(id, player) {
        const players = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const index = players.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            players[index] = { ...player, id: parseInt(id) };
            localStorage.setItem(this.storageKey, JSON.stringify(players));
            return Promise.resolve(players[index]);
        }
        return Promise.reject(new Error('Player not found'));
    }

    delete(id) {
        const players = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const filtered = players.filter(p => p.id !== parseInt(id));
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        return Promise.resolve(true);
    }
}

