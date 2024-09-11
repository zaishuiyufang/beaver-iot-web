import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default () => {
    return (
        <>
            <Typography variant="h3">Register</Typography>
            <Typography>Hi, I'm register page!</Typography>
            <Link to="/">Home</Link>
        </>
    );
};
