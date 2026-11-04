import { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate
} from 'react-router-dom'

import {
    AppBar,
    Toolbar,
    Button,
    Container,
    Box,
    Typography,
    CssBaseline,
    ThemeProvider,
    createTheme
} from '@mui/material'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggleable'

const theme = createTheme({
    palette: {
        primary: {
            main: '#263b5a',
        },
        background: {
            default: '#f4f6f8',
        },
    },
    shape: {
        borderRadius: 8,
    },
})

const AppContent = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')

        if (loggedUserJSON) {
            const loggedUser = JSON.parse(loggedUserJSON)
            setUser(loggedUser)
        }
    }, [])

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const blogs = await blogService.getAll()
                setBlogs(blogs)
            } catch (exception) {
                setNotification({
                    type: 'error',
                    message: exception.response?.data?.error || 'Failed to fetch blogs'
                })
            }
        }

        fetchBlogs()
    }, [])

    const handleLikeBlog = async (blog) => {
        try {
            const loggedUser = JSON.parse(
                window.localStorage.getItem('loggedUser')
            )

            const updatedBlog = {
                ...blog,
                likes: blog.likes + 1
            }

            const response = await blogService.update(
                blog.id,
                updatedBlog,
                loggedUser.token
            )

            setBlogs(currentBlogs =>
                currentBlogs.map(b =>
                    b.id === blog.id ? response : b
                )
            )
        } catch (exception) {
            setNotification({
                type: 'error',
                message: exception.response?.data?.error || 'Failed to like blog'
            })
        }
    }

    const handleCreateBlog = async (newBlog) => {
        try {
            const loggedUser = JSON.parse(
                window.localStorage.getItem('loggedUser')
            )

            const createdBlog = await blogService.create(
                newBlog,
                loggedUser.token
            )

            setBlogs(currentBlogs => currentBlogs.concat(createdBlog))

            setNotification({
                type: 'success',
                message: 'Blog created successfully'
            })

            navigate('/')
        } catch (exception) {
            setNotification({
                type: 'error',
                message: exception.response?.data?.error || 'Failed to create blog'
            })
        }
    }

    const handleDeleteBlog = async (blog) => {
        if (!window.confirm(`Are you sure you want to delete the blog "${blog.title}" by ${blog.author}?`)) {
            return
        }

        try {
            const loggedUser = JSON.parse(
                window.localStorage.getItem('loggedUser')
            )

            await blogService.remove(blog.id, loggedUser.token)

            setBlogs(currentBlogs =>
                currentBlogs.filter(b => b.id !== blog.id)
            )

            setNotification({
                type: 'success',
                message: 'Blog deleted successfully'
            })

            navigate('/')
        } catch (exception) {
            setNotification({
                type: 'error',
                message: exception.response?.data?.error || 'Failed to delete blog'
            })
        }
    }

    const handleLogin = async (username, password) => {
        try {
            const loggedUser = await loginService.login({
                username,
                password
            })

            window.localStorage.setItem(
                'loggedUser',
                JSON.stringify(loggedUser)
            )

            setUser(loggedUser)

            setNotification({
                type: 'success',
                message: `Welcome ${loggedUser.name}`
            })

            navigate('/')
        } catch (exception) {
            setNotification({
                type: 'error',
                message: exception.response?.data?.error || 'Invalid username or password'
            })
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedUser')
        setUser(null)
        navigate('/')
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <AppBar position="static" elevation={1}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            mr: 4,
                        }}
                    >
                        Bloglist
                    </Typography>

                    <Button
                        component={Link}
                        to="/"
                        color="inherit"
                        sx={{ mr: 1 }}
                    >
                        Blogs
                    </Button>

                    {user === null ? (
                        <Button
                            component={Link}
                            to="/login"
                            color="inherit"
                        >
                            Login
                        </Button>
                    ) : (
                        <>
                            <Button
                                component={Link}
                                to="/create"
                                color="inherit"
                            >
                                Create Blog
                            </Button>

                            <Box sx={{ flexGrow: 1 }} />

                            <Typography sx={{ mr: 2 }}>
                                {user.name} logged in
                            </Typography>

                            <Button
                                color="inherit"
                                variant="outlined"
                                onClick={handleLogout}
                            >
                                logout
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Notification notification={notification} />

                <Routes>
                    <Route
                        path="/login"
                        element={<LoginForm handleLogin={handleLogin} />}
                    />

                    <Route
                        path="/"
                        element={
                            <Box>
                                <Typography variant="h4" sx={{ mb: 3 }}>
                                    Blogs
                                </Typography>

                                {[...blogs]
                                    .sort((a, b) => b.likes - a.likes)
                                    .map(blog => (
                                        <Blog
                                            key={blog.id}
                                            blog={blog}
                                            handleLikeBlog={handleLikeBlog}
                                            handleDeleteBlog={handleDeleteBlog}
                                            user={user}
                                        />
                                    ))}
                            </Box>
                        }
                    />

                    <Route
                        path="/create"
                        element={
                            user !== null ? (
                                <Box>
                                    <Typography variant="h4" sx={{ mb: 3 }}>
                                        Create a new blog
                                    </Typography>

                                    <Togglable buttonLabel="new blog" cancelLabel="cancel">
                                        <BlogForm handleCreateBlog={handleCreateBlog} />
                                    </Togglable>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography>
                                        You must be logged in to create a blog.
                                    </Typography>
                                    <Button component={Link} to="/login">
                                        Login
                                    </Button>
                                </Box>
                            )
                        }
                    />
                </Routes>
            </Container>
        </Box>
    )
}

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <AppContent />
            </Router>
        </ThemeProvider>
    )
}

export default App