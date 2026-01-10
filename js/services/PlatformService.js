// Platform Service
export class PlatformService {
    constructor() {
        this.storageKey = 'mymanager_platforms';
        this.initData();
    }

    initData() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultPlatforms = [
                { id: 1, name: 'PC', company: 'Various', releaseYear: 1981 },
                { id: 2, name: 'PlayStation 5', company: 'Sony', releaseYear: 2020 },
                { id: 3, name: 'Xbox Series X', company: 'Microsoft', releaseYear: 2020 },
                { id: 4, name: 'Nintendo Switch', company: 'Nintendo', releaseYear: 2017 },
                { id: 5, name: 'PlayStation 4', company: 'Sony', releaseYear: 2013 },
                { id: 6, name: 'Xbox One', company: 'Microsoft', releaseYear: 2013 },
                { id: 7, name: 'Steam Deck', company: 'Valve', releaseYear: 2022 }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(defaultPlatforms));
        }
    }

    getAll() {
        const platforms = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        return Promise.resolve(platforms);
    }

    getById(id) {
        const platforms = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const platform = platforms.find(p => p.id === parseInt(id));
        return Promise.resolve(platform || null);
    }

    create(platform) {
        const platforms = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const newId = platforms.length > 0 ? Math.max(...platforms.map(p => p.id)) + 1 : 1;
        const newPlatform = { ...platform, id: newId };
        platforms.push(newPlatform);
        localStorage.setItem(this.storageKey, JSON.stringify(platforms));
        return Promise.resolve(newPlatform);
    }

    update(id, platform) {
        const platforms = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const index = platforms.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            platforms[index] = { ...platform, id: parseInt(id) };
            localStorage.setItem(this.storageKey, JSON.stringify(platforms));
            return Promise.resolve(platforms[index]);
        }
        return Promise.reject(new Error('Platform not found'));
    }

    delete(id) {
        const platforms = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const filtered = platforms.filter(p => p.id !== parseInt(id));
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        return Promise.resolve(true);
    }
}

