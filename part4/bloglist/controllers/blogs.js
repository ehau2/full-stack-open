const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    return response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const user = request.user
    if (!user) {
        return response.status(401).json({
            error: 'user not authenticated',
        })
    }

    const { title, author, url, likes } = request.body
    if (!title || !url) {
        return response.status(400).json({
            error: 'title or url missing',
        })
    }

    const blog = new Blog({
        title,
        author,
        url,
        likes: likes ?? 0,
        user: user._id,
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    return response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    const user = request.user

    if (!user) {
        return response.status(401).json({
            error: 'user not authenticated',
        })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).end()
    }
    
    if (!blog.user || blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({
            error: 'only the creator can delete this blog',
        })
    }

    await Blog.findByIdAndDelete(blog._id)

    user.blogs = user.blogs.filter(
        blogId => blogId.toString() !== blog._id.toString()
    )

    await user.save()

    return response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const user = request.user

    if (!user) {
        return response.status(401).json({
            error: 'user not authenticated',
        })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).end()
    }

    if (!blog.user || blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({
            error: 'only the creator can update this blog',
        })
    }

    const { title, author, url, likes } = request.body

    if (title !== undefined) blog.title = title
    if (author !== undefined) blog.author = author
    if (url !== undefined) blog.url = url
    if (likes !== undefined) blog.likes = likes

    const updatedBlog = await blog.save()

    return response.json(updatedBlog)
})

module.exports = blogRouter