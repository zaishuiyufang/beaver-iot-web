import { useEffect } from 'react';
import { TextField } from '@mui/material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useI18n } from '@milesight/shared/src/hooks';
import { Modal, toast, type ModalProps } from '@milesight/shared/src/components';
import { checkRequired } from '@milesight/shared/src/utils/validators';
import { awaitWrap, deviceAPI, isRequestSuccess, type DeviceAPISchema } from '@/services/http';

interface Props extends Omit<ModalProps, 'onOk'> {
    /** 设备详情 */
    data?: ObjectToCamelCase<DeviceAPISchema['getDetail']['response']>;

    /** 编辑失败回调 */
    onError?: (error?: any) => void;

    /** 编辑成功回调 */
    onSuccess?: () => void;
}

interface FormDataProps {
    name: string;
}

const EditDialog: React.FC<Props> = ({ data, visible, onCancel, onError, onSuccess }) => {
    const { getIntlText } = useI18n();
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

        // onSuccess?.();
        await new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
                onSuccess?.();
                toast.success(getIntlText('common.message.operation_success'));
            }, 5000);
        });
    };

    // 填充/重置表单
    useEffect(() => {
        if (!visible || !data) {
            setTimeout(reset, 100);
            return;
        }

        (Object.keys(data) as (keyof FormDataProps)[]).forEach(key => {
            setValue(key, data[key]);
        });
    }, [data, visible, reset, setValue]);

    return (
        <Modal
            visible={visible}
            title={getIntlText('device.detail.edit_title', { 1: data?.name })}
            onCancel={onCancel}
            onOk={handleSubmit(onSubmit)}
        >
            <Controller<FormDataProps>
                name="name"
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
                            label="Device Name"
                            error={!!error}
                            disabled={disabled}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                        />
                    );
                }}
            />
        </Modal>
    );
};

export default EditDialog;
