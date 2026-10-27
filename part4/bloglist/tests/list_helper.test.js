const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const {
    listWithOneBlog,
    listWithManyBlogs,
    mostLikedBlog,
    mostBlogsByAuthor,
    mostLikesByAuthor
} = require('./data/blogs')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when list has many blogs, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithManyBlogs)
        assert.strictEqual(result, 36)
    })
})

describe('favorite blog', () => {
    test('when list has many blogs, return the most liked blog', () => {
        const result = listHelper.favoriteBlog(listWithManyBlogs)
        assert.deepStrictEqual(result, mostLikedBlog)
    })
})

describe('most blogs', () => {
    test('returns the author with the most blogs', () => {
        const result = listHelper.mostBlog(listWithManyBlogs)
        assert.deepStrictEqual(result, mostBlogsByAuthor)
    })
})

describe('most likes', () => {
    test('returns the author with the most total likes', () => {
        const result = listHelper.mostLikes(listWithManyBlogs)
        assert.deepStrictEqual(result, mostLikesByAuthor)
    })
})