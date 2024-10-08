import { Fragment, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import useI18n from '../../hooks/useI18n';
import './style.less';

export interface ModalProps {
    onCancel: () => void;
    onOk: () => void;
    /**
     * 取消按钮文字
     */
    onCancelText?: string;
    /**
     * 确认按钮文字
     */
    onOkText?: string;
    /**
     * 是否显示弹框
     */
    visible?: boolean;
    /**
     * 弹框标题
     */
    title?: string;
    /**
     * 自定义弹框宽度
     * @description 有值是size属性不生效
     */
    width?: string;
    /**
     * 弹框尺寸
     * @description 选值：small(200px)、medium(450px)、large(600px)、full(100%)
     */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /**
     * 弹框内容
     */
    children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = props => {
    const { getIntlText } = useI18n();
    const { onOk, onCancel, onCancelText, onOkText, title, width, size, visible, children } = props;

    const ModalWidth = useMemo(() => {
        if (width) {
            return width;
        }
        if (size) {
            switch (size) {
                case 'sm':
                    return '200px';
                case 'md':
                    return '450px';
                case 'lg':
                    return '600px';
                case 'xl':
                    return '800px';
                case 'full':
                    return '100%';
                default:
                    return '450px';
            }
        }
        return '450px';
    }, [width, size]);

    const handleClose = () => {
        onCancel();
    };

    const handleOk = () => {
        onOk();
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={visible !== undefined ? visible : true}
            sx={{ '& .MuiDialog-paper': { width: ModalWidth, maxWidth: 'none' } }}
        >
            {!!title && (
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {title}
                </DialogTitle>
            )}
            <DialogContent>{children}</DialogContent>
            <DialogActions className="modal-footer">
                <Button variant="outlined" onClick={handleClose}>
                    {onCancelText || getIntlText('common.button.cancel')}
                </Button>
                <Button variant="contained" onClick={handleOk} className="modal-button">
                    {onOkText || getIntlText('common.button.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Modal;
