const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Game name is required.'],
      trim: true,
      minlength: [1, 'Game name cannot be empty.'],
      maxlength: [80, 'Game name cannot exceed 80 characters.'],
      unique: true
    },
    genre: {
      type: String,
      required: [true, 'Genre is required.'],
      trim: true
    },
    platform: {
      type: String,
      required: [true, 'Platform is required.'],
      trim: true
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release year is required.'],
      min: [1950, 'Release year must be 1950 or later.'],
      max: [currentYear + 2, `Release year cannot exceed ${currentYear + 2}.`],
      validate: {
        validator: Number.isInteger,
        message: 'Release year must be a whole number.'
      }
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required.'],
      min: [0, 'Rating cannot be below 0.'],
      max: [10, 'Rating cannot exceed 10.']
    }
  },
  { timestamps: true }
);

gameSchema.index({ title: 1 }, { unique: true });

module.exports = mongoose.model('Game', gameSchema);
