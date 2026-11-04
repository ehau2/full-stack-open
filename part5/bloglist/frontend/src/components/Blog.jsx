import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Link
} from '@mui/material'

import Toggleable from './Toggleable'

const Blog = ({ blog, handleLikeBlog, handleDeleteBlog, user }) => {
    return (
        <Card
            className="blog"
            elevation={2}
            sx={{
                mb: 2,
                borderLeft: '4px solid',
                borderColor: 'primary.main',
            }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    component="span"
                    className="blog-title"
                >
                    {blog.title}
                </Typography>

                <Typography
                    variant="body2"
                    component="span"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                    className="blog-author"
                >
                    by {blog.author}
                </Typography>

                <CardActions sx={{ px: 0, pt: 2 }}>
                    <Toggleable buttonLabel="view" cancelLabel="hide">
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            <Link
                                href={blog.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {blog.url}
                            </Link>
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                            Likes: {blog.likes}
                        </Typography>

                        {user && (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleLikeBlog(blog)}
                                sx={{ mr: 1 }}
                            >
                                like
                            </Button>
                        )}

                        {user && blog.user &&
                            user.username === blog.user.username && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDeleteBlog(blog)}
                                >
                                    delete
                                </Button>
                            )}

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 2 }}
                        >
                            Added by {blog.user?.name}
                        </Typography>
                    </Toggleable>
                </CardActions>
            </CardContent>
        </Card>
    )
}

export default Blog