import { useMemo, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    type DialogProps,
} from '@mui/material';
import useI18n from '../../hooks/useI18n';
import LoadingButton from '../loading-button';
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
     * 是否禁止点击遮罩层关闭弹框
     */
    disabledBackdropClose?: boolean;
    /**
     * 弹框内容
     */
    children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    size,
    title,
    width,
    visible,
    onOkText,
    onCancelText,
    disabledBackdropClose = true,
    onOk,
    onCancel,
    children,
}) => {
    const { getIntlText } = useI18n();
    const [loading, setLoading] = useState<boolean>();

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

    const handleClose = useMemoizedFn<NonNullable<DialogProps['onClose']>>((_, reason) => {
        if (disabledBackdropClose && reason === 'backdropClick') return;
        onCancel();
    });

    const handleOk = useMemoizedFn(async () => {
        setLoading(true);
        await onOk();
        setLoading(false);
    });

    return (
        <Dialog
            aria-labelledby="customized-dialog-title"
            className="ms-modal-root"
            open={!!visible}
            onClose={handleClose}
            sx={{ '& .MuiDialog-paper': { width: ModalWidth, maxWidth: 'none' } }}
        >
            {!!title && (
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {title}
                </DialogTitle>
            )}
            <DialogContent>{children}</DialogContent>
            <DialogActions className="ms-modal-footer">
                <Button
                    variant="outlined"
                    disabled={loading}
                    onClick={onCancel}
                    sx={{ mr: 1, '&:last-child': { mr: 0 } }}
                >
                    {onCancelText || getIntlText('common.button.cancel')}
                </Button>
                <LoadingButton
                    variant="contained"
                    className="ms-modal-button"
                    loading={loading}
                    onClick={handleOk}
                >
                    {onOkText || getIntlText('common.button.confirm')}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default Modal;
