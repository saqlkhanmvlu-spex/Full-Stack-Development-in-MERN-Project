require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('./models/Game');

const sampleGames = [
  { title: 'Minecraft', genre: 'Adventure', platform: 'PC', releaseYear: 2011, rating: 9.0 },
  { title: 'Forza Horizon 5', genre: 'Racing', platform: 'Xbox', releaseYear: 2021, rating: 8.8 },
  { title: 'The Legend of Zelda: Breath of the Wild', genre: 'Adventure', platform: 'Nintendo Switch', releaseYear: 2017, rating: 9.7 },
  { title: 'EA Sports FC 25', genre: 'Sports', platform: 'PlayStation', releaseYear: 2024, rating: 7.5 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gamevault');
    const count = await Game.countDocuments();
    if (count === 0) {
      await Game.insertMany(sampleGames);
      console.log('Sample games inserted.');
    } else {
      console.log(`Seed skipped: ${count} game record(s) already exist.`);
    }
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
