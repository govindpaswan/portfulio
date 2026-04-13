const express = require('express');
const router = express.Router();
const Education = require('../models/Education');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json(education);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { degree, institute, startYear, endYear, description, order } = req.body;
    if (!degree || !institute || !startYear) {
      return res.status(400).json({ message: 'Degree, institute, and start year are required.' });
    }
    const edu = new Education({ degree, institute, startYear, endYear, description, order });
    await edu.save();
    res.status(201).json(edu);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!edu) return res.status(404).json({ message: 'Education record not found.' });
    res.json(edu);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const edu = await Education.findByIdAndDelete(req.params.id);
    if (!edu) return res.status(404).json({ message: 'Education record not found.' });
    res.json({ message: 'Education record deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
