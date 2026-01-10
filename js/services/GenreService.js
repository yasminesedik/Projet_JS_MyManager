// Genre Service
export class GenreService {
    constructor() {
        this.storageKey = 'mymanager_genres';
        this.initData();
    }

    initData() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultGenres = [
                { id: 1, name: 'RPG', description: 'Role-playing games' },
                { id: 2, name: 'Action', description: 'Action-packed adventures' },
                { id: 3, name: 'FPS', description: 'First-person shooters' },
                { id: 4, name: 'Racing', description: 'Racing and driving games' },
                { id: 5, name: 'Platform', description: 'Platform jumping games' },
                { id: 6, name: 'Strategy', description: 'Strategic thinking games' },
                { id: 7, name: 'Sports', description: 'Sports simulation games' },
                { id: 8, name: 'Puzzle', description: 'Puzzle solving games' }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(defaultGenres));
        }
    }

    getAll() {
        const genres = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        return Promise.resolve(genres);
    }

    getById(id) {
        const genres = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const genre = genres.find(g => g.id === parseInt(id));
        return Promise.resolve(genre || null);
    }

    create(genre) {
        const genres = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const newId = genres.length > 0 ? Math.max(...genres.map(g => g.id)) + 1 : 1;
        const newGenre = { ...genre, id: newId };
        genres.push(newGenre);
        localStorage.setItem(this.storageKey, JSON.stringify(genres));
        return Promise.resolve(newGenre);
    }

    update(id, genre) {
        const genres = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const index = genres.findIndex(g => g.id === parseInt(id));
        if (index !== -1) {
            genres[index] = { ...genre, id: parseInt(id) };
            localStorage.setItem(this.storageKey, JSON.stringify(genres));
            return Promise.resolve(genres[index]);
        }
        return Promise.reject(new Error('Genre not found'));
    }

    delete(id) {
        const genres = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const filtered = genres.filter(g => g.id !== parseInt(id));
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        return Promise.resolve(true);
    }
}

