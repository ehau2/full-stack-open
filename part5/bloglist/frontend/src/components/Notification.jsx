import { useState, useEffect } from 'react'
import { Alert, Box } from '@mui/material'

const Notification = ({ notification }) => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (!notification) {
            setVisible(false)
            return
        }

        setVisible(true)

        const timer = setTimeout(() => {
            setVisible(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [notification])

    if (!visible || !notification) {
        return null
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Alert severity={notification.type}>
                {notification.message}
            </Alert>
        </Box>
    )
}

export default Notification