const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ title: { $exists: true, $ne: '' } }).sort({ featured: -1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create project (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, image, techStack, liveLink, githubLink, featured } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Title is required.' });
    if (!description?.trim()) return res.status(400).json({ message: 'Description is required.' });
    const project = new Project({
      title: title.trim(),
      description: description.trim(),
      image: image || '',
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      featured: Boolean(featured),
      techStack: Array.isArray(techStack)
        ? techStack.filter(t => t.trim())
        : (techStack ? techStack.split(',').map(s => s.trim()).filter(Boolean) : [])
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error('Project POST:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update project (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.techStack && !Array.isArray(update.techStack)) {
      update.techStack = update.techStack.split(',').map(s => s.trim()).filter(Boolean);
    }
    update.featured = Boolean(update.featured);
    const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE project (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
