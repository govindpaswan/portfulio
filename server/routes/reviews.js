const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// GET all reviews (public) - filter out corrupt records
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    // Sanitize: ensure rating is always a valid number
    const clean = reviews.map(r => {
      const obj = r.toObject();
      obj.rating = Number(obj.rating);
      if (isNaN(obj.rating) || obj.rating < 1 || obj.rating > 5) obj.rating = 5;
      return obj;
    });
    res.json(clean);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create review (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { name, photo, rating, message, designation } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required.' });
    if (!message?.trim()) return res.status(400).json({ message: 'Message is required.' });
    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5)
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    const review = new Review({ name: name.trim(), photo: photo || '', rating: ratingNum, message: message.trim(), designation: designation || '' });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error('Review POST:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update review (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const update = { ...req.body };
    update.rating = Number(update.rating);
    if (isNaN(update.rating) || update.rating < 1 || update.rating > 5) update.rating = 5;
    const review = await Review.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE review (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    res.json({ message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
