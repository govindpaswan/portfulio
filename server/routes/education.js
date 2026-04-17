const express = require('express');
const router = express.Router();
const Education = require('../models/Education');
const auth = require('../middleware/auth');

// GET all education (public) - filter corrupt
router.get('/', async (req, res) => {
  try {
    const education = await Education.find({ degree: { $exists: true, $ne: '' }, institute: { $exists: true, $ne: '' } }).sort({ order: 1, createdAt: -1 });
    res.json(education);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create education (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { degree, institute, startYear, endYear, description, order } = req.body;
    if (!degree?.trim()) return res.status(400).json({ message: 'Degree is required.' });
    if (!institute?.trim()) return res.status(400).json({ message: 'Institute is required.' });
    if (!startYear?.toString().trim()) return res.status(400).json({ message: 'Start year is required.' });
    const edu = new Education({
      degree: degree.trim(), institute: institute.trim(),
      startYear: startYear.toString().trim(),
      endYear: endYear?.toString().trim() || 'Present',
      description: description || '',
      order: Number(order) || 0
    });
    await edu.save();
    res.status(201).json(edu);
  } catch (err) {
    console.error('Education POST:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update education (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!edu) return res.status(404).json({ message: 'Education record not found.' });
    res.json(edu);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE education (admin)
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
