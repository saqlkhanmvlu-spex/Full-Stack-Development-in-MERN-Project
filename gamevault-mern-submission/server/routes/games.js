const express = require('express');
const mongoose = require('mongoose');
const Game = require('../models/Game');

const router = express.Router();

function validateGame(data) {
  const { title, genre, platform, releaseYear, rating } = data;
  const year = Number(releaseYear);
  const score = Number(rating);
  const currentYear = new Date().getFullYear();

  if (
    typeof title !== 'string' || !title.trim() ||
    typeof genre !== 'string' || !genre.trim() ||
    typeof platform !== 'string' || !platform.trim() ||
    releaseYear === '' || releaseYear === undefined ||
    !Number.isInteger(year) || year < 1950 || year > currentYear + 2 ||
    rating === '' || rating === undefined ||
    !Number.isFinite(score) || score < 0 || score > 10
  ) {
    return 'Enter a valid title, genre, platform, release year, and rating (0–10).';
  }
  return null;
}

function isDuplicateError(error) {
  return error && error.code === 11000;
}

// GET all games, with optional title search: /api/games?search=mario
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }
    const games = await Game.find(filter).sort({ title: 1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Unable to retrieve games.' });
  }
});

// GET one game
router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid game ID.' });
  }
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found.' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Unable to retrieve game.' });
  }
});

// POST a new game
router.post('/', async (req, res) => {
  const validationError = validateGame(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const game = await Game.create({
      title: req.body.title.trim(),
      genre: req.body.genre.trim(),
      platform: req.body.platform.trim(),
      releaseYear: Number(req.body.releaseYear),
      rating: Number(req.body.rating)
    });
    res.status(201).json({ message: 'Game added successfully.', game });
  } catch (error) {
    if (isDuplicateError(error)) {
      return res.status(409).json({ message: 'A game with this title already exists.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Unable to add game.' });
  }
});

// PUT update a game
router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid game ID.' });
  }
  const validationError = validateGame(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found.' });

    game.title = req.body.title.trim();
    game.genre = req.body.genre.trim();
    game.platform = req.body.platform.trim();
    game.releaseYear = Number(req.body.releaseYear);
    game.rating = Number(req.body.rating);
    await game.save();

    res.json({ message: 'Game updated successfully.', game });
  } catch (error) {
    if (isDuplicateError(error)) {
      return res.status(409).json({ message: 'A game with this title already exists.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Unable to update game.' });
  }
});

// DELETE a game
router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid game ID.' });
  }
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found.' });
    res.json({ message: 'Game deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete game.' });
  }
});

module.exports = router;
