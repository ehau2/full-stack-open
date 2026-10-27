const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((favorite, blog) =>
        blog.likes > favorite.likes ? blog : favorite
    )
}

const mostBlog = (blogs) => {
    const authors = {}
    blogs.forEach(blog => {
        authors[blog.author] = (authors[blog.author] || 0) + 1
    })
    const author = Object.keys(authors).reduce((a, b) =>
        authors[a] > authors[b] ? a : b
    )
    return { author, blogs: authors[author] }
}

const mostLikes = (blogs) => {
    const authors = {}
    blogs.forEach(blog => {
        authors[blog.author] = (authors[blog.author] || 0) + blog.likes
    })
    const author = Object.keys(authors).reduce((a, b) =>
        authors[a] > authors[b] ? a : b
    )
    return { author, likes: authors[author] }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlog,
    mostLikes,
}