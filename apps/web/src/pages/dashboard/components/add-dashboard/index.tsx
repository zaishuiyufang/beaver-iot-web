import { useState } from 'react';
import { useI18n } from '@milesight/shared/src/hooks';
import { Modal } from '@milesight/shared/src/components';

interface ConfigPluginProps {
    onCancel: () => void;
    onOk: (data: AddDashboardProps) => void;
    data?: AddDashboardProps;
}

const AddDashboard = (props: ConfigPluginProps) => {
    const { getIntlText } = useI18n();
    const { onOk, onCancel, data } = props;

    const handleClose = () => {
        onCancel();
    };

    return (
        <Modal
            onCancel={handleClose}
            onOk={onOk}
            title={`${getIntlText(data?.id ? 'dashboard.add_title' : 'dashboard.edit_title')}`}
        >
            1111
        </Modal>
    );
};

export default AddDashboard;
