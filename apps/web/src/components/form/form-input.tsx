import { TextField, type TextFieldProps } from '@mui/material';
import { Controller, type ControllerProps } from 'react-hook-form';

export interface FormInputProps extends Omit<ControllerProps, 'render'> {
    renderProps?: Omit<TextFieldProps, 'name' | 'error' | 'helperText' | 'fullWidth'>;
}

/**
 * React Hook Form 文本输入框组件
 */
const FormInputText: React.FC<FormInputProps> = ({
    renderProps: {
        label,
        disabled,
        type = 'text',
        variant = 'outlined',
        rows = 1,
        multiline = false,
        autoFocus = false,
        ...renderProps
    } = {},
    ...props
}) => {
    return (
        <Controller
            {...props}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                    helperText={error ? error.message : null}
                    sx={{ my: 1.5 }}
                    size="small"
                    margin="dense"
                    error={!!error}
                    fullWidth
                    label={label}
                    disabled={disabled}
                    type={type}
                    rows={rows}
                    multiline={multiline}
                    autoFocus={autoFocus}
                    onChange={onChange}
                    value={value}
                    variant={variant}
                    {...renderProps}
                />
            )}
        />
    );
};

export default FormInputText;
