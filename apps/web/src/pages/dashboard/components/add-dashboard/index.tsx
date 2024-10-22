import { useState, useRef } from 'react';
import { useI18n } from '@milesight/shared/src/hooks';
import { Modal, Form } from '@milesight/shared/src/components';

interface ConfigPluginProps {
    onCancel: () => void;
    onOk: (data: AddDashboardType) => void;
    data?: AddDashboardType;
}

const AddDashboard = (props: ConfigPluginProps) => {
    const { getIntlText } = useI18n();
    const { onOk, onCancel, data } = props;
    const formRef = useRef<any>();

    const formItems = [
        {
            label: getIntlText('dashboard.dashboard_name'),
            name: 'name',
            type: 'TextField',
            defaultValue: data?.name,
            rules: {
                required: true,
                maxLength: {
                    value: 2,
                    message: 'name is too long',
                },
            },
        },
    ];

    const handleClose = () => {
        onCancel();
    };

    const handleOk = () => {
        formRef.current?.handleSubmit();
    };

    const handleSubmit = (values: AddDashboardType) => {
        onOk(values);
    };

    return (
        <Modal
            onCancel={handleClose}
            onOk={handleOk}
            title={`${getIntlText(data?.id ? 'dashboard.add_title' : 'dashboard.edit_title')}`}
        >
            <Form<AddDashboardType> ref={formRef} formItems={formItems} onOk={handleSubmit} />
        </Modal>
    );
};

export default AddDashboard;
