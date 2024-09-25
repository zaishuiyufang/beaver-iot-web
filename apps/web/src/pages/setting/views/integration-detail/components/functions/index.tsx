import { IconButton, Grid2 } from '@mui/material';
import { ArrowForwardIos as ArrowForwardIosIcon } from '@mui/icons-material';
import './style.less';

const Functions = () => {
    return (
        <div className="ms-int-functions">
            <Grid2 container spacing={2}>
                <Grid2 size={{ sm: 6, md: 4, xl: 3 }}>
                    <div className="ms-int-feat-card">
                        <div className="header">
                            <h3 className="title">Webhook Service</h3>
                            <IconButton>
                                <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </div>
                        <div className="desc">
                            This service will pull all device information from the Milesight
                            Development Platform that is bound to a connected application and will
                            not update device information if the device already exists.
                        </div>
                    </div>
                </Grid2>
                <Grid2 size={{ sm: 6, md: 4, xl: 3 }}>
                    <div className="ms-int-feat-card">
                        <div className="header">
                            <h3 className="title">Query the historical data</h3>
                            <IconButton>
                                <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </div>
                        <div className="desc">
                            This service is used to manually pull telemetry data reported by devices
                            to the Milesight Development Platform.
                        </div>
                    </div>
                </Grid2>
            </Grid2>
        </div>
    );
};

export default Functions;
