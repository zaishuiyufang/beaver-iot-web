import { useState } from 'react';
import { Alert, IconButton, Grid2 } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useI18n } from '@milesight/shared/src/hooks';
import { Modal, ChevronRightIcon } from '@milesight/shared/src/components';
import { IntegrationAPISchema } from '@/services/http';
import { useConfirm, Tooltip, DateRangePicker } from '@/components';
import './style.less';

interface FormDataProps {
    startTime?: number;
    endTime?: number;
}

interface Props {
    /** 实体列表 */
    entities?: ObjectToCamelCase<
        IntegrationAPISchema['getDetail']['response']['integration_entities'][0]
    >;
}

const Functions: React.FC<Props> = ({ entities }) => {
    const { getIntlText } = useI18n();
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
                {getIntlText('setting.integration.available_function_warning_text')}
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
                            <IconButton sx={{ width: 24, height: 24 }}>
                                <ChevronRightIcon />
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
                            <IconButton sx={{ width: 24, height: 24 }}>
                                <ChevronRightIcon />
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
                <DateRangePicker label={{ start: 'Start date', end: 'End date' }} />
            </Modal>
        </div>
    );
};

export default Functions;
