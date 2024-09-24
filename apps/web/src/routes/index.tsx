import { Navigate } from 'react-router-dom';
import RootLayout from '@/layouts';
import routes from './routes';

export default [
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" />,
            },
            ...routes,
        ],
    },
];
