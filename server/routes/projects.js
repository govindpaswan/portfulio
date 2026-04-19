const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create project (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, image, techStack, liveLink, githubLink, featured } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }
    const project = new Project({
      title, description, image, githubLink, liveLink, featured,
      techStack: Array.isArray(techStack)
        ? techStack
        : (techStack ? techStack.split(',').map(s => s.trim()) : [])
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update project (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.techStack && !Array.isArray(update.techStack)) {
      update.techStack = update.techStack.split(',').map(s => s.trim());
    }
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
