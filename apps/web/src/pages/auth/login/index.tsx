import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default () => {
    return (
        <>
            <Typography variant="h3">Login</Typography>
            <Typography>Hi, I'm login page !</Typography>
            <Link to="/">Home</Link>
        </>
    );
};
