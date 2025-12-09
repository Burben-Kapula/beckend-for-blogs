const router = require('express').Router()
const Blog = require('../models/blogs')
const authMiddleware = require('../utils/authMiddleware')  // ✅ ДОДАНО

// GET /api/blogs - отримати всі блоги (публічні)
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

// POST /api/blogs - створити новий блог (потрібен токен)
router.post('/', authMiddleware, async (req, res) => {   // ✅ ДОДАНО middleware
  try {
    console.log('Create blog - user:', req.user)
    console.log('Create blog - body:', req.body)

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
      author: req.user.id        // id з токена
    })

    const savedBlog = await blog.save()
    console.log('Blog saved:', savedBlog)

    const populatedBlog = await Blog.findById(savedBlog._id)
      .populate('author', 'username email')

    console.log('Blog populated:', populatedBlog)
    res.status(201).json(populatedBlog)
  } catch (error) {
    console.error('Error creating blog:', error)
    res.status(500).json({ error: 'Failed to create blog' })
  }
})

// PUT /api/blogs/:id - оновити блог (потрібен токен)
router.put('/:id', authMiddleware, async (req, res) => {   // ✅ ДОДАНО middleware
  try {
    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' })
    }

    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    // Перевіряємо чи користувач є автором блогу
    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this blog' })
    }

    blog.title = title
    blog.content = content
    blog.updatedAt = new Date()

    const updatedBlog = await blog.save()
    const populatedBlog = await Blog.findById(updatedBlog._id)
      .populate('author', 'username email')

    res.json(populatedBlog)
  } catch (error) {
    console.error('Error updating blog:', error)
    res.status(500).json({ error: 'Failed to update blog' })
  }
})

// DELETE /api/blogs/:id - видалити блог (потрібен токен)
router.delete('/:id', authMiddleware, async (req, res) => {   // ✅ ДОДАНО middleware
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


// POST /api/blogs/:id/like - лайк/унлайк блогу
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const userId = req.user.id
    const index = blog.likes.findIndex(id => id.toString() === userId)

    if (index === -1) {
      // ще не лайкнув -> додаємо лайк
      blog.likes.push(userId)
    } else {
      // вже лайкнув -> забираємо лайк
      blog.likes.splice(index, 1)
    }

    const saved = await blog.save()
    const populated = await Blog.findById(saved._id)
      .populate('author', 'username email')

    res.json(populated)
  } catch (error) {
    console.error('Error toggling like:', error)
    res.status(500).json({ error: 'Failed to toggle like' })
  }
})

// POST /api/blogs/:id/comments - додати коментар
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' })
    }

    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    blog.comments.push({
      user: req.user.id,
      text: text.trim()
    })

    const saved = await blog.save()
    const populated = await Blog.findById(saved._id)
      .populate('author', 'username email')
      .populate('comments.user', 'username')

    res.status(201).json(populated)
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({ error: 'Failed to add comment' })
  }
})





module.exports = router
