import React, { useState } from 'react';
import { useI18n } from '@milesight/shared/src/hooks';
import { Modal, type ModalProps } from '@milesight/shared/src/components';

interface Props extends Omit<ModalProps, 'onOk'> {
    onError?: (err: any) => void;
    onSuccess?: () => void;
}

/**
 * 设备添加弹窗
 */
const AddModal: React.FC<Props> = ({ visible, ...props }) => {
    const { getIntlText } = useI18n();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Modal
            visible={visible}
            title={getIntlText('common.label.add')}
            onOk={() => console.log('handle ok...')}
            {...props}
        >
            Todo: ...
        </Modal>
    );
};

export default AddModal;
