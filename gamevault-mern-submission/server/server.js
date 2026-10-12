require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Game = require('./models/Game');
const gameRoutes = require('./routes/games');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gamevault';

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GAMEVAULT backend is running.' });
});

app.use('/api/games', gameRoutes);

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);

    // Seed only when the games collection is empty, so existing records are preserved.
    const count = await Game.countDocuments();
    if (count === 0) {
      const sampleGames = [
        { title: 'Minecraft', genre: 'Adventure', platform: 'PC', releaseYear: 2011, rating: 9.0 },
        { title: 'Forza Horizon 5', genre: 'Racing', platform: 'Xbox', releaseYear: 2021, rating: 8.8 },
        { title: 'The Legend of Zelda: Breath of the Wild', genre: 'Adventure', platform: 'Nintendo Switch', releaseYear: 2017, rating: 9.7 },
        { title: 'EA Sports FC 25', genre: 'Sports', platform: 'PlayStation', releaseYear: 2024, rating: 7.5 }
      ];
      await Game.insertMany(sampleGames);
      console.log('Sample games inserted.');
    }

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Games API: http://localhost:${PORT}/api/games`);
    });
  } catch (error) {
    console.error('Backend startup failed:', error.message);
    console.error('Check that MongoDB is running and server/.env is correct.');
    process.exit(1);
  }
}

startServer();
