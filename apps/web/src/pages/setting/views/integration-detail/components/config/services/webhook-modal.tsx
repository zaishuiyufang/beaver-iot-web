import React, { useMemo } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { TextField } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { checkRequired } from '@milesight/shared/src/utils/validators';
import { Modal, toast, type ModalProps } from '@milesight/shared/src/components';
import { entityAPI, awaitWrap, getResponseData, isRequestSuccess } from '@/services/http';

interface Props extends Omit<ModalProps, 'onOk'> {
    /**
     * 弹窗模式
     * @param edit 编辑
     * @param switch 开关
     */
    mode: 'edit' | 'switch';

    /** 保存错误回调 */
    onError?: (error?: any) => void;

    /** 保存成功回调 */
    onSuccess?: () => void;
}

interface FormDataProps {
    url: string;
    secretKey: string;
}

/**
 * Webhook 编辑弹窗
 */
const WebhookModal: React.FC<Props> = ({ mode, visible, onCancel, onError, onSuccess }) => {
    const { getIntlText } = useI18n();
    const title = useMemo(() => {
        const subTitle = getIntlText('common.label.webhook');
        switch (mode) {
            case 'edit':
                return getIntlText('common.label.edit_title', { 1: subTitle });
            case 'switch':
                return getIntlText('common.label.enable_title', { 1: subTitle });
            default:
                return '';
        }
    }, [mode, getIntlText]);

    // ---------- 表单数据处理 ----------
    const { control, formState, handleSubmit, reset, setValue } = useForm<FormDataProps>();
    const onSubmit: SubmitHandler<FormDataProps> = async formData => {
        console.log(formData);
        // TODO: 以下为临时 Mock 处理，待接口正常返回数据后调整
        // if (!data?.id) return;

        // const [error, resp] = await awaitWrap(
        //     deviceAPI.updateDevice({ id: data.id, name: formData.name }),
        // );

        // if (error || !isRequestSuccess(resp)) {
        //     onError?.(error);
        //     return;
        // }

        onSuccess?.();
        // await new Promise(resolve => {
        //     setTimeout(() => {
        //         resolve(true);
        //         onSuccess?.();
        //         toast.success(getIntlText('common.message.operation_success'));
        //     }, 5000);
        // });
    };

    return (
        <Modal title={title} visible={visible} onCancel={onCancel} onOk={handleSubmit(onSubmit)}>
            <div className="ms-inte-service-webhook">
                <Controller<FormDataProps>
                    name="url"
                    control={control}
                    disabled={formState.isSubmitting}
                    rules={{
                        validate: { checkRequired: checkRequired() },
                    }}
                    render={({ field: { onChange, value, disabled }, fieldState: { error } }) => {
                        return (
                            <TextField
                                required
                                fullWidth
                                size="small"
                                margin="dense"
                                label={getIntlText('setting.integration.webhook_url')}
                                error={!!error}
                                disabled={disabled}
                                helperText={error ? error.message : null}
                                value={value}
                                onChange={onChange}
                            />
                        );
                    }}
                />
                <Controller<FormDataProps>
                    name="secretKey"
                    control={control}
                    disabled={formState.isSubmitting}
                    rules={{
                        validate: { checkRequired: checkRequired() },
                    }}
                    render={({ field: { onChange, value, disabled }, fieldState: { error } }) => {
                        return (
                            <TextField
                                required
                                fullWidth
                                size="small"
                                margin="dense"
                                label={getIntlText('setting.integration.webhook_secret_key')}
                                error={!!error}
                                disabled={disabled}
                                helperText={error ? error.message : null}
                                value={value}
                                onChange={onChange}
                            />
                        );
                    }}
                />
            </div>
        </Modal>
    );
};

export default WebhookModal;
