const request = require('supertest')
const app = require('../app')

describe('User API', () => {
  describe('POST /api/auth/register', () => {
    test('should return 400 for missing username', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400)

      expect(response.body.error).toBe('username, email and password are required')
    })

    test('should return 400 for missing email', async () => {
      const newUser = {
        username: 'testuser',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400)

      expect(response.body.error).toBe('username, email and password are required')
    })

    test('should return 400 for missing password', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400)

      expect(response.body.error).toBe('username, email and password are required')
    })

    test('should return 400 for invalid email', async () => {
      const newUser = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400)

      expect(response.body.error).toBe('invalid email')
    })

    test('should return 400 for short username', async () => {
      const newUser = {
        username: 'ab',
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400)

      expect(response.body.error).toBe('username must be at least 3 characters')
    })

    test('should return 400 for short password', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400)

      expect(response.body.error).toBe('password must be at least 6 characters')
    })
  })

  describe('POST /api/auth/login', () => {
    test('should return 400 for missing username/email', async () => {
      const loginData = {
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400)

      expect(response.body.error).toBe('username/email and password are required')
    })

    test('should return 400 for missing password', async () => {
      const loginData = {
        usernameOrEmail: 'testuser'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400)

      expect(response.body.error).toBe('username/email and password are required')
    })

    // Skip MongoDB-dependent test for now
    // test('should return 401 for non-existent user', async () => {
    //   const loginData = {
    //     usernameOrEmail: 'nonexistent',
    //     password: 'password123'
    //   }

    //   const response = await request(app)
    //     .post('/api/auth/login')
    //     .send(loginData)
    //     .expect(401)

    //   expect(response.body.error).toBe('invalid credentials')
    // })
  })
})