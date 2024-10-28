import React, { useMemo } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { TextField, InputAdornment } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { checkRequired, checkRangeValue } from '@milesight/shared/src/utils/validators';
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
    frequency: number;
}

/**
 * Openapi 编辑弹窗
 */
const OpenapiModal: React.FC<Props> = ({ mode, visible, onCancel, onError, onSuccess }) => {
    const { getIntlText } = useI18n();
    const title = useMemo(() => {
        const subTitle = getIntlText('common.label.openapi');
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
            <Controller<FormDataProps>
                name="frequency"
                control={control}
                disabled={formState.isSubmitting}
                rules={{
                    validate: {
                        checkRequired: checkRequired(),
                        checkRangeValue: checkRangeValue({ min: 30, max: 86400 }),
                    },
                }}
                render={({ field: { onChange, value, disabled }, fieldState: { error } }) => {
                    return (
                        <TextField
                            required
                            fullWidth
                            size="small"
                            margin="dense"
                            label={getIntlText('setting.integration.openapi_frequency_of_request')}
                            error={!!error}
                            disabled={disabled}
                            helperText={
                                error
                                    ? error.message
                                    : getIntlText(
                                          'setting.integration.openapi_frequency_helper_text',
                                      )
                            }
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">s</InputAdornment>,
                                },
                            }}
                            value={value}
                            onChange={onChange}
                        />
                    );
                }}
            />
        </Modal>
    );
};

export default OpenapiModal;