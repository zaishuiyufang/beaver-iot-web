import { Typography } from '@mui/material';
import { Breadcrumbs } from '@/components';

export default () => {
    return (
        <div className="ms-main">
            <Breadcrumbs />
            <div className="ms-view ms-view-device-detail">
                <div className="ms-view__inner">
                    <Typography variant="h3">Device Detail</Typography>
                    <Typography>Hello World!</Typography>
                </div>
            </div>
        </div>
    );
};
