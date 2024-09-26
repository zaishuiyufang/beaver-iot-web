import { useState } from 'react';
import { Alert, IconButton, Grid2 } from '@mui/material';
import { ArrowForwardIos as ArrowForwardIosIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { Modal } from '@milesight/shared/src/components';
import { useConfirm, Tooltip } from '@/components';
import './style.less';

interface FormDataProps {
    startTime?: number;
    endTime?: number;
}

const Functions = () => {
    const confirm = useConfirm();
    const [modalOpen, setModalOpen] = useState(false);
    const handleConfirm = () => {
        confirm({
            title: 'Device Batch Synchronization',
            description:
                'Confirm or not to perform this operation. synchronization will only add non-existing devices and will not update the information of existing devices.',
            async onConfirm() {
                // Todo: 接口调用
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                        console.log('confirm...');
                    }, 2000);
                });
            },
        });
    };

    return (
        <div className="ms-int-functions">
            <Alert severity="warning" sx={{ mb: 2.5 }}>
                The following functions are not available and need to be configured with Open API
                under integrated configuration before they can be used
            </Alert>
            <Grid2 container spacing={2}>
                <Grid2 size={{ sm: 6, md: 4, xl: 3 }}>
                    <div className="ms-int-feat-card" onClick={handleConfirm}>
                        <div className="header">
                            <Tooltip
                                autoEllipsis
                                className="title"
                                title="Pull added device information"
                            />
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
                    <div className="ms-int-feat-card" onClick={() => setModalOpen(true)}>
                        <div className="header">
                            <Tooltip
                                autoEllipsis
                                className="title"
                                title="Query the historical data"
                            />
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
            <Modal
                visible={modalOpen}
                title="Query the historical data"
                onCancel={() => setModalOpen(false)}
                onOk={() => console.log('handle ok...')}
            >
                <span>ABC</span>
            </Modal>
        </div>
    );
};

export default Functions;
