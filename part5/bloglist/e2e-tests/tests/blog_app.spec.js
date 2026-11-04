
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/testing/reset')

        await request.post('http://localhost:3001/api/users', {
            data: {
                username: 'testuser',
                name: 'Test User',
                password: 'password123'
            }
        })

        await page.goto('http://localhost:5173')
    })

    const login = async (page, username = 'testuser', password = 'password123') => {
        await page.getByRole('link', { name: 'Login' }).click()

        await page.getByLabel('username').fill(username)
        await page.getByLabel('password').fill(password)

        await page.getByRole('button', { name: 'login' }).click()
    }

    const createBlog = async (page, title, author, url) => {
        await page.getByRole('link', { name: 'Create Blog' }).click()

        await page.getByRole('button', { name: 'new blog' }).click()

        await page.getByLabel('title').fill(title)
        await page.getByLabel('author').fill(author)
        await page.getByLabel('url').fill(url)

        await page.getByRole('button', { name: 'create' }).click()

        await expect(page.getByText(title)).toBeVisible()
    }

    test('Login form is shown', async ({ page }) => {
        await page.getByRole('link', { name: 'Login' }).click()

        await expect(
            page.getByRole('heading', { name: 'Login' })
        ).toBeVisible()

        await expect(page.getByLabel('username')).toBeVisible()
        await expect(page.getByLabel('password')).toBeVisible()

        await expect(
            page.getByRole('button', { name: 'login' })
        ).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await login(page)

            await expect(
                page.getByRole('button', { name: 'logout' })
            ).toBeVisible()

            await expect(
                page.getByText('Test User logged in')
            ).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await login(page, 'testuser', 'wrongpassword')

            await expect(
                page.getByText(/invalid username or password/i)
            ).toBeVisible()

            await expect(
                page.getByRole('button', { name: 'login' })
            ).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await login(page)

            await expect(
                page.getByRole('button', { name: 'logout' })
            ).toBeVisible()
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(
                page,
                'My Playwright Blog',
                'John Doe',
                'https://example.com'
            )

            await expect(
                page.getByText('Blog created successfully')
            ).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await createBlog(
                page,
                'Blog to like',
                'John Doe',
                'https://example.com'
            )

            const blog = page.locator('.blog').filter({
                hasText: 'Blog to like'
            })

            await blog.getByRole('button', { name: 'view' }).click()

            await expect(blog.getByText('Likes: 0')).toBeVisible()

            await blog.getByRole('button', { name: 'like' }).click()

            await expect(blog.getByText('Likes: 1')).toBeVisible()
        })

        test('the user who added the blog can delete it', async ({ page }) => {
            await createBlog(
                page,
                'Blog to delete',
                'John Doe',
                'https://example.com'
            )

            const blog = page.locator('.blog').filter({
                hasText: 'Blog to delete'
            })

            await blog.getByRole('button', { name: 'view' }).click()

            page.on('dialog', dialog => dialog.accept())

            await blog.getByRole('button', { name: 'delete' }).click()

            await expect(blog).toHaveCount(0)
        })

        test('only the user who added the blog sees the delete button', async ({ page, request }) => {
            await createBlog(
                page,
                'Blog by testuser',
                'John Doe',
                'https://example.com'
            )

            await page.getByRole('button', { name: 'logout' }).click()

            await request.post('http://localhost:3001/api/users', {
                data: {
                    username: 'anotheruser',
                    name: 'Another User',
                    password: 'password123'
                }
            })

            await login(page, 'anotheruser')

            await expect(
                page.getByRole('button', { name: 'logout' })
            ).toBeVisible()

            const blog = page.locator('.blog').filter({
                hasText: 'Blog by testuser'
            })

            await blog.getByRole('button', { name: 'view' }).click()

            await expect(
                blog.getByRole('button', { name: 'delete' })
            ).toHaveCount(0)
        })

        test('blogs are ordered according to likes, with the most liked first', async ({ page }) => {
            await createBlog(
                page,
                'Blog with few likes',
                'Author 1',
                'https://example.com/1'
            )

            await createBlog(
                page,
                'Blog with most likes',
                'Author 2',
                'https://example.com/2'
            )

            await createBlog(
                page,
                'Blog with some likes',
                'Author 3',
                'https://example.com/3'
            )

            const fewLikes = page.locator('.blog').filter({
                hasText: 'Blog with few likes'
            })

            const mostLikes = page.locator('.blog').filter({
                hasText: 'Blog with most likes'
            })

            const someLikes = page.locator('.blog').filter({
                hasText: 'Blog with some likes'
            })

            await expect(page.locator('.blog')).toHaveCount(3)

            // Give the most-liked blog 3 likes
            await mostLikes.getByRole('button', { name: 'view' }).click()

            for (let i = 1; i <= 3; i++) {
                await mostLikes.getByRole('button', { name: 'like' }).click()
                await expect(mostLikes.getByText(`Likes: ${i}`)).toBeVisible()
            }

            // Give the second blog 1 like
            await someLikes.getByRole('button', { name: 'view' }).click()

            await someLikes.getByRole('button', { name: 'like' }).click()

            await expect(someLikes.getByText('Likes: 1')).toBeVisible()

            // Verify order
            const titles = await page.locator('.blog-title').allTextContents()

            expect(titles).toEqual([
                'Blog with most likes',
                'Blog with some likes',
                'Blog with few likes'
            ])
        })
    })
})
