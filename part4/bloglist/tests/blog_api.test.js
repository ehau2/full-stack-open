const { test, before, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token

// Set up the test database and create a test user
before(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const username = 'blogtestuser'
    const password = 'password123'

    await api
        .post('/api/users')
        .send({
            username,
            name: 'Blog Test User',
            password,
        })
        .expect(201)

    const response = await api
        .post('/api/login')
        .send({ username, password })
        .expect(200)

    token = response.body.token
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('id property is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
})

test('a valid blog can be added', async () => {
    const initialBlogs = await api.get('/api/blogs')

    const newBlog = {
        title: 'New test blog',
        author: 'New test author',
        url: 'https://example.com',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs')

    assert.strictEqual(
        blogs.body.length,
        initialBlogs.body.length + 1
    )

    assert.ok(
        blogs.body.some(blog => blog.title === newBlog.title)
    )
})

test('if likes is missing, it defaults to 0', async () => {
    const newBlog = {
        title: 'Blog without likes',
        author: 'Test Author',
        url: 'https://example.com',
    }

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

    assert.strictEqual(response.body.likes, 0)
})

test('if title is missing, status is 400', async () => {
    const newBlog = {
        author: 'Test Author',
        url: 'https://example.com',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
})

test('if url is missing, status is 400', async () => {
    const newBlog = {
        title: 'Blog without URL',
        author: 'Test Author',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
})

test('a blog can be deleted by its creator', async () => {
    const newBlog = {
        title: 'Blog to delete',
        author: 'Test Author',
        url: 'https://example.com',
        likes: 5,
    }

    const createdBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

    await api
        .delete(`/api/blogs/${createdBlog.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogs = await api.get('/api/blogs')

    assert.ok(
        !blogs.body.some(blog => blog.id === createdBlog.body.id)
    )
})

test('a blog can be updated', async () => {
    const newBlog = {
        title: 'Blog to update',
        author: 'Test Author',
        url: 'https://example.com',
        likes: 5,
    }

    const createdBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

    const updatedBlog = await api
        .put(`/api/blogs/${createdBlog.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likes: 10 })
        .expect(200)

    assert.strictEqual(updatedBlog.body.likes, 10)
})

after(async () => {
    await mongoose.connection.close()
})