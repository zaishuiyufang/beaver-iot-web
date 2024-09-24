import {
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    FormHelperText,
    type SelectProps,
    type MenuItemProps,
} from '@mui/material';
import React from 'react';
import { Controller, type ControllerProps } from 'react-hook-form';

export interface FormSelectProps extends Omit<ControllerProps, 'render'> {
    options: { key?: ApiKey; label: MenuItemProps['children']; value: MenuItemProps['value'] }[];
    renderProps?: Omit<SelectProps, 'error' | 'helperText' | 'fullWidth'>;
}

/**
 * React Hook Form 选择框组件
 */
const FormSelect: React.FC<FormSelectProps> = ({
    name,
    options,
    renderProps: { label, ...renderProps } = {},
    ...props
}) => {
    return (
        <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel id={`input-label-${name}`}>{label}</InputLabel>
            <Controller
                name={name}
                key={`select-${name}`}
                {...props}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                        <Select
                            fullWidth
                            id={`input-select-${name}`}
                            labelId={`input-label-${name}`}
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            label={label}
                            {...renderProps}
                        >
                            {options.map(option => (
                                <MenuItem key={`${name}-${option.value}`} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {!!error && <FormHelperText error>{error.message}</FormHelperText>}
                    </>
                )}
            />
        </FormControl>
    );
};

export default FormSelect;
