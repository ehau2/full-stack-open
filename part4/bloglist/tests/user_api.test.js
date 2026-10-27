
const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

// Run before each test, empty the test DB
beforeEach(async () => {
    await User.deleteMany({})
})

test('users are returned as json', async () => {
    await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('a valid user can be created', async () => {
    const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'password123',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})

    assert.strictEqual(usersAtEnd.length, 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert.ok(usernames.includes(newUser.username))
})

test('creating a user fails if username is too short', async () => {
    const newUser = {
        username: 'ab',
        name: 'Test User',
        password: 'password123',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 0)
})

test('creating a user fails if password is too short', async () => {
    const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'ab',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 0)
})

test('creating a user fails without a username', async () => {
    const newUser = {
        name: 'Test User',
        password: 'password123',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 0)
})

test('creating a user fails without a password', async () => {
    const newUser = {
        username: 'testuser',
        name: 'Test User',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 0)
})

test('creating a user fails if username is already taken', async () => {
    const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'password123',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1)
})

after(async () => {
    await mongoose.connection.close()
})