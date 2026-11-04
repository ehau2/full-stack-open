import { useState } from 'react'
import { Box, Button } from '@mui/material'

const Toggleable = (props) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => setVisible(!visible)

    return (
        <Box>
            <Box sx={hideWhenVisible}>
                <Button
                    variant="contained"
                    size="small"
                    onClick={toggleVisibility}
                >
                    {props.buttonLabel}
                </Button>
            </Box>

            <Box sx={showWhenVisible}>
                {props.children}

                <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    onClick={toggleVisibility}
                    sx={{ mt: 2 }}>
                    {props.cancelLabel}
                </Button>
            </Box>
        </Box>
    )
}

export default Toggleable