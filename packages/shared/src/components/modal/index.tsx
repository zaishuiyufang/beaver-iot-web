import { Fragment, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useI18n } from '../../hooks';
import './style.less';

interface ModalProps {
    onCancel: Function;
    onOk: Function;
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
    size?: string;
    /**
     * 弹框内容
     */
    children?: React.ReactNode;
}

const AddDashboard: React.FC<ModalProps> = (props) => {
    const { getIntlText } = useI18n();
    const {
        onOk,
        onCancel,
        onCancelText,
        onOkText,
        title,
        width,
        size,
        visible,
        children
    } = props;

    const ModalWidth = useMemo(() => {
        if (width) {
            return width;
        }
        if (size) {
            switch (size) {
                case 'small':
                    return '200px';
                case 'medium':
                    return '450px';
                case 'large':
                    return '600px';
                case 'full':
                    return '100%';
                default:
                    return '450px';
            }
        }
        return '450px';
    }, [width, size])

    const handleClose = () => {
        onCancel();
    };

    const handleOk = () => {
        onOk();
    };

    return (
        <Fragment>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={visible !== undefined ? visible : true}
                sx={{ '& .MuiDialog-paper': { width: ModalWidth, maxWidth: 'none' } }}
            >
                {
                    !!title && (
                        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            {title}
                        </DialogTitle>
                    )
                }
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions className="modal-footer">
                    <Button variant="outlined" onClick={handleClose}>
                        {onCancelText || getIntlText('common.button.cancel')}
                    </Button>
                    <Button variant="contained" onClick={handleOk} className="modal-button">
                        {onOkText || getIntlText('common.button.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default AddDashboard;