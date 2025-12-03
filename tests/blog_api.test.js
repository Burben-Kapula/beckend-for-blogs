const request = require('supertest')
const app = require('../app')

describe('Blog API', () => {
  describe('GET /api/blogs', () => {
    test('should return 401 when not authenticated', async () => {
      await request(app)
        .get('/api/blogs')
        .expect(401)
    })

    test('should return 401 with invalid token', async () => {
      await request(app)
        .get('/api/blogs')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
    })
  })

  describe('POST /api/blogs', () => {
    test('should return 401 when not authenticated', async () => {
      const newBlog = {
        title: 'Test Blog',
        content: 'This is a test blog content'
      }

      await request(app)
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })
})