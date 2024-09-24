import {
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    FormControlLabel,
    FormHelperText,
    type RadioGroupProps,
    type MenuItemProps,
} from '@mui/material';
import React from 'react';
import { Controller, type ControllerProps } from 'react-hook-form';

export interface FormRadioProps extends Omit<ControllerProps, 'render'> {
    label?: string;
    options: { key?: ApiKey; label: MenuItemProps['children']; value: MenuItemProps['value'] }[];
    renderProps?: RadioGroupProps;
}

/**
 * React Hook Form 单选框组件
 */
const FormRadio: React.FC<FormRadioProps> = ({ name, label, options, renderProps, ...props }) => {
    return (
        <FormControl fullWidth sx={{ my: 1 }}>
            <FormLabel id={`radio-group-label-${name}`}>{label}</FormLabel>
            <Controller
                name={name}
                key={`select-${name}`}
                {...props}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                        <RadioGroup
                            aria-labelledby={`radio-group-label-${name}`}
                            value={value}
                            onChange={onChange}
                            {...renderProps}
                        >
                            {options.map(option => (
                                <FormControlLabel
                                    value={option.value}
                                    label={option.label}
                                    control={<Radio />}
                                />
                            ))}
                        </RadioGroup>
                        {!!error && <FormHelperText error>{error.message}</FormHelperText>}
                    </>
                )}
            />
        </FormControl>
    );
};

export default FormRadio;
