const router = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
const mongoose = require('mongoose')

// GET /api/blogs - отримати всі блоги
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
    
    res.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    res.status(500).json({ error: 'Failed to fetch blogs' })
  }
})

// POST /api/blogs - створити новий блог
router.post('/', async (req, res) => {
  try {
    console.log('Create blog - user:', req.user) // Debug log
    console.log('Create blog - body:', req.body) // Debug log
    
    const { title, content } = req.body
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' })
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    const blog = new Blog({
      title,
      content,
      author: req.user.id
    })

    const savedBlog = await blog.save()
    console.log('Blog saved:', savedBlog) // Debug log
    
    const populatedBlog = await Blog.findById(savedBlog._id)
      .populate('author', 'username email')

    console.log('Blog populated:', populatedBlog) // Debug log
    res.status(201).json(populatedBlog)
  } catch (error) {
    console.error('Error creating blog:', error)
    res.status(500).json({ error: 'Failed to create blog' })
  }
})

// DELETE /api/blogs/:id - видалити блог
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    // Перевіряємо чи користувач є автором блогу
    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this blog' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting blog:', error)
    res.status(500).json({ error: 'Failed to delete blog' })
  }
})

module.exports = router
