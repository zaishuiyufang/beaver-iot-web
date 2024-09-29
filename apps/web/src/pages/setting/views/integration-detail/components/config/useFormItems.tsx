import { useState, useMemo, useCallback } from 'react';
import { type ControllerProps } from 'react-hook-form';
import {
    TextField,
    IconButton,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    type TextFieldProps,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { checkRequired } from '@milesight/shared/src/utils/validators';

export interface FormDataProps {
    address?: string;
    clientId?: string;
    clientSecret?: string;
}

const useFormItems = () => {
    const [showSecret, setShowSecret] = useState(false);
    const handleClickShowSecret = useCallback(() => setShowSecret(show => !show), []);

    const formItems = useMemo(() => {
        const commTextProps: Partial<TextFieldProps> = {
            required: true,
            fullWidth: true,
            type: 'text',
        };

        const items: ControllerProps<FormDataProps>[] = [
            {
                name: 'address',
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <FormControl fullWidth size="small" sx={{ my: 1.5 }}>
                            <InputLabel id="select-label-address">Server Address</InputLabel>
                            <Select
                                label="Server Address"
                                labelId="select-label-address"
                                error={!!error}
                                value={value}
                                onChange={onChange}
                            >
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                            </Select>
                            {!!error && <FormHelperText error>{error.message}</FormHelperText>}
                        </FormControl>
                    );
                },
            },
            {
                name: 'clientId',
                rules: {
                    validate: { checkRequired: checkRequired() },
                },
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <TextField
                            {...commTextProps}
                            label="Client ID"
                            error={!!error}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                        />
                    );
                },
            },
            {
                name: 'clientSecret',
                rules: {
                    validate: { checkRequired: checkRequired() },
                },
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <TextField
                            {...commTextProps}
                            label="Client Secret"
                            type={showSecret ? 'text' : 'password'}
                            error={!!error}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowSecret}
                                                onMouseDown={e => e.preventDefault()}
                                                onMouseUp={e => e.preventDefault()}
                                                edge="end"
                                            >
                                                {showSecret ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <VisibilityIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    );
                },
            },
        ];

        return items;
    }, [showSecret, handleClickShowSecret]);

    return formItems;
};

export default useFormItems;
