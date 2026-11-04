import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { expect, test, vi } from 'vitest'
import Blog from './Blog'

const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5
}

const user = {
    username: 'testuser',
    name: 'Test User'
}

test('renders title and author, but not URL or likes by default', () => {
    render(
        <Blog
            blog={blog}
            handleLikeBlog={vi.fn()}
            handleDeleteBlog={vi.fn()}
            user={user}
        />
    )

    expect(screen.getByText(blog.title)).toBeVisible()
    expect(screen.getByText(/John Doe/)).toBeVisible()

    expect(screen.getByText(blog.url)).not.toBeVisible()
    expect(screen.getByText(`Likes: ${blog.likes}`)).not.toBeVisible()
})

test('shows URL and likes when view button is clicked', async () => {
    const userEventSetup = userEvent.setup()

    render(
        <Blog
            blog={blog}
            handleLikeBlog={vi.fn()}
            handleDeleteBlog={vi.fn()}
            user={user}
        />
    )

    await userEventSetup.click(screen.getByRole('button', { name: 'view' }))

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(`Likes: ${blog.likes}`)).toBeVisible()
})

test('calls the like handler twice when like button is clicked twice', async () => {
    const userEventSetup = userEvent.setup()
    const handleLikeBlog = vi.fn()

    render(
        <Blog
            blog={blog}
            handleLikeBlog={handleLikeBlog}
            handleDeleteBlog={vi.fn()}
            user={user}
        />
    )

    await userEventSetup.click(screen.getByRole('button', { name: 'view' }))

    const likeButton = screen.getByRole('button', { name: 'like' })

    await userEventSetup.click(likeButton)
    await userEventSetup.click(likeButton)

    expect(handleLikeBlog).toHaveBeenCalledTimes(2)
    expect(handleLikeBlog).toHaveBeenCalledWith(blog)
})