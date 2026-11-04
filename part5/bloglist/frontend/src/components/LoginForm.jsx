import { useState } from 'react'
import {
    Paper,
    Box,
    TextField,
    Button,
    Typography
} from '@mui/material'

const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        handleLogin(username, password)
    }

    return (
        <Paper elevation={2} sx={{ p: 4, maxWidth: 450, mx: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Login
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                <TextField
                    label="username"
                    type="text"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                    fullWidth
                />

                <TextField
                    label="password"
                    type="password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    fullWidth
                />

                <Button type="submit" variant="contained">
                    login
                </Button>
            </Box>
        </Paper>
    )
}

export default LoginForm