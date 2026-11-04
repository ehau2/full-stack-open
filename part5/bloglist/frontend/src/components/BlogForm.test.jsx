import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls the event handler with the correct details when a new blog is created', async () => {
    const user = userEvent.setup()
    const handleCreateBlog = vi.fn()

    render(
        <BlogForm handleCreateBlog={handleCreateBlog} />
    )

    await user.type(screen.getByLabelText('title'), 'My new blog')
    await user.type(screen.getByLabelText('author'), 'John Doe')
    await user.type(screen.getByLabelText('url'), 'https://example.com')

    await user.click(screen.getByRole('button', { name: 'create' }))

    expect(handleCreateBlog).toHaveBeenCalledTimes(1)
    expect(handleCreateBlog).toHaveBeenCalledWith({
        title: 'My new blog',
        author: 'John Doe',
        url: 'https://example.com'
    })
})