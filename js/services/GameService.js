// Game Service
export class GameService {
  constructor() {
    this.storageKey = "mymanager_games";
    this.initData();
  }

  initData() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultGames = [
        {
          id: 1,
          name: "The Witcher 3",
          genre: "RPG",
          platform: "PC",
          price: 29.99,
          releaseDate: "2015-05-19",
          rating: 9.5,
          description: "An open-world RPG adventure",
        },
        {
          id: 2,
          name: "Cyberpunk 2077",
          genre: "RPG",
          platform: "PC",
          price: 49.99,
          releaseDate: "2020-12-10",
          rating: 7.5,
          description: "Futuristic RPG in Night City",
        },
        {
          id: 3,
          name: "God of War",
          genre: "Action",
          platform: "PlayStation",
          price: 39.99,
          releaseDate: "2018-04-20",
          rating: 9.8,
          description: "Epic action-adventure game",
        },
        {
          id: 4,
          name: "Halo Infinite",
          genre: "FPS",
          platform: "Xbox",
          price: 59.99,
          releaseDate: "2021-12-08",
          rating: 8.5,
          description: "Master Chief returns",
        },
        {
          id: 5,
          name: "Mario Odyssey",
          genre: "Platform",
          platform: "Nintendo Switch",
          price: 59.99,
          releaseDate: "2017-10-27",
          rating: 9.7,
          description: "3D platforming adventure",
        },
        {
          id: 6,
          name: "Elden Ring",
          genre: "RPG",
          platform: "PC",
          price: 59.99,
          releaseDate: "2022-02-25",
          rating: 9.6,
          description: "Open-world action RPG",
        },
        {
          id: 7,
          name: "Horizon Zero Dawn",
          genre: "Action",
          platform: "PlayStation",
          price: 19.99,
          releaseDate: "2017-02-28",
          rating: 9.3,
          description: "Post-apocalyptic action RPG",
        },
        {
          id: 8,
          name: "Forza Horizon 5",
          genre: "Racing",
          platform: "Xbox",
          price: 59.99,
          releaseDate: "2021-11-09",
          rating: 9.0,
          description: "Open-world racing game",
        },
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(defaultGames));
    }
  }

  getAll() {
    const games = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
    return Promise.resolve(games);
  }

  getById(id) {
    const games = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
    const game = games.find((g) => g.id === parseInt(id));
    return Promise.resolve(game || null);
  }

  create(game) {
    const games = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
    const newId =
      games.length > 0 ? Math.max(...games.map((g) => g.id)) + 1 : 1;
    const newGame = { ...game, id: newId };
    games.push(newGame);
    localStorage.setItem(this.storageKey, JSON.stringify(games));
    return Promise.resolve(newGame);
  }

  update(id, game) {
    const games = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
    const index = games.findIndex((g) => g.id === parseInt(id));
    if (index !== -1) {
      games[index] = { ...game, id: parseInt(id) };
      localStorage.setItem(this.storageKey, JSON.stringify(games));
      return Promise.resolve(games[index]);
    }
    return Promise.reject(new Error("Game not found"));
  }

  delete(id) {
    const games = JSON.parse(localStorage.getItem(this.storageKey) || "[]");
    const filtered = games.filter((g) => g.id !== parseInt(id));
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return Promise.resolve(true);
  }
}
