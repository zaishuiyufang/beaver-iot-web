import { useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    type DialogProps,
} from '@mui/material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { checkRequired } from '@milesight/shared/src/utils/validators';
import { type DeviceAPISchema } from '@/services/http';

interface Props extends DialogProps {
    /** 设备详情 */
    data?: ObjectToCamelCase<DeviceAPISchema['getDetail']['response']>;

    /** 点击取消 Button 回调 */
    onCancel: () => void;

    /** 编辑失败回调 */
    onError?: () => void;

    /** 编辑成功回调 */
    onSuccess?: () => void;
}

interface FormDataProps {
    name: string;
}

const EditDialog: React.FC<Props> = ({ data, open, onCancel, onError, onSuccess, ...props }) => {
    const { control, handleSubmit, reset, setValue } = useForm<FormDataProps>();
    const onSubmit: SubmitHandler<FormDataProps> = data => console.log(data);

    // 填充/重置表单
    useEffect(() => {
        if (!open || !data) {
            reset();
            return;
        }

        (Object.keys(data) as (keyof FormDataProps)[]).forEach(key => {
            setValue(key, data[key]);
        });
    }, [data, open, reset, setValue]);

    return (
        <Dialog open={open} {...props}>
            <DialogTitle>Edit {data?.name}</DialogTitle>
            <DialogContent sx={{ width: 400 }}>
                <Controller<FormDataProps>
                    name="name"
                    control={control}
                    rules={{
                        validate: { checkRequired: checkRequired() },
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => {
                        return (
                            <TextField
                                required
                                fullWidth
                                size="small"
                                margin="dense"
                                label="Device Name"
                                error={!!error}
                                helperText={error ? error.message : null}
                                value={value}
                                onChange={onChange}
                            />
                        );
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onCancel} sx={{ textTransform: 'none' }}>
                    Cancel
                </Button>
                <Button
                    autoFocus
                    variant="contained"
                    sx={{ textTransform: 'none' }}
                    onClick={handleSubmit(onSubmit)}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
