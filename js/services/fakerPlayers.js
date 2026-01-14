// fakerPlayers.js

export function generateFakePlayers(count = 20) {
  const genres = ["RPG", "Action", "FPS", "Racing", "Platform"];
  const countries = [
    "USA",
    "UK",
    "France",
    "Spain",
    "Morocco",
    "Japan",
    "Canada",
    "UAE",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 40 }),
    country: faker.helpers.arrayElement(countries),
    favoriteGenre: faker.helpers.arrayElement(genres),
  }));
}
