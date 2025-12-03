// In-memory database for testing without MongoDB
let users = []
let blogs = []
let nextId = 1

const generateId = () => (nextId++).toString()

// User methods
const findUser = (query) => {
  if (query._id) {
    return users.find(u => u._id === query._id)
  }
  if (query.username) {
    return users.find(u => u.username === query.username)
  }
  if (query.email) {
    return users.find(u => u.email === query.email)
  }
  if (query.$or) {
    return users.find(u => 
      query.$or.some(condition => 
        (condition.username && u.username === condition.username) ||
        (condition.email && u.email === condition.email)
      )
    )
  }
  return null
}

const createUser = async (userData) => {
  const user = {
    _id: generateId(),
    ...userData,
    id: generateId()
  }
  users.push(user)
  return user
}

const saveUser = async (user) => {
  const index = users.findIndex(u => u._id === user._id)
  if (index !== -1) {
    users[index] = user
    return user
  }
  return await createUser(user)
}

// Blog methods
const findBlogs = () => blogs

const createBlog = async (blogData) => {
  const blog = {
    _id: generateId(),
    ...blogData,
    id: generateId(),
    createdAt: new Date()
  }
  blogs.push(blog)
  return blog
}

// Mock mongoose
const mockMongoose = {
  connect: () => Promise.resolve(),
  connection: {
    readyState: 1
  },
  model: (name, schema) => {
    if (name === 'User') {
      return {
        findOne: findUser,
        create: createUser,
        save: saveUser
      }
    }
    if (name === 'Blog') {
      return {
        find: findBlogs,
        create: createBlog
      }
    }
  }
}

module.exports = mockMongoose