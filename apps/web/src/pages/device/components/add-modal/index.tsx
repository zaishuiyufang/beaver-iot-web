import React, { useState } from 'react';
import { Modal, type ModalProps } from '@milesight/shared/src/components';

interface Props extends Omit<ModalProps, 'onOk'> {
    onError?: (err: any) => void;
    onSuccess?: () => void;
}

/**
 * 设备添加弹窗
 */
const AddModal: React.FC<Props> = ({ visible, ...props }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Modal visible={visible} title="Add" onOk={() => console.log('handle ok...')} {...props}>
            Todo: ...
        </Modal>
    );
};

export default AddModal;
