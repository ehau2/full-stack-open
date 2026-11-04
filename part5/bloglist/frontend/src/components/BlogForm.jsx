import { useState } from 'react'
import {
    Paper,
    Box,
    TextField,
    Button,
    Typography
} from '@mui/material'

const BlogForm = ({ handleCreateBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        handleCreateBlog({ title, author, url })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <Paper elevation={2} sx={{ p: 3, maxWidth: 500 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                New blog
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                <TextField
                    label="title"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                    fullWidth
                />

                <TextField
                    label="author"
                    value={author}
                    onChange={({ target }) => setAuthor(target.value)}
                    fullWidth
                />

                <TextField
                    label="url"
                    value={url}
                    onChange={({ target }) => setUrl(target.value)}
                    fullWidth
                />

                <Button type="submit" variant="contained">
                    create
                </Button>
            </Box>
        </Paper>
    )
}

export default BlogForm