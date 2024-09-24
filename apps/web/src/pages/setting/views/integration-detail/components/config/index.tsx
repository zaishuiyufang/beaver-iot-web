import { useMemo } from 'react';
import {
    Button,
    Tooltip,
    Chip,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    type TextFieldProps,
} from '@mui/material';
import { InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material';
import { useForm, Controller, type SubmitHandler, type ControllerProps } from 'react-hook-form';
import './style.less';

interface FormDataProps {
    address?: string;
    clientId?: string;
    clientSecret?: string;
}

/**
 * 集成配置组件
 */
const Config = () => {
    const { control, handleSubmit } = useForm<FormDataProps>();
    const onSubmit: SubmitHandler<FormDataProps> = data => console.log(data);

    const formItems = useMemo(() => {
        const commTextProps: Partial<TextFieldProps> = {
            required: true,
            fullWidth: true,
            type: 'text',
            size: 'small',
            margin: 'dense',
            sx: { my: 1.5 },
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
                                value={value}
                                error={!!error}
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
                    required: 'clientId is required',
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
                    required: 'clientSecret is required',
                },
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <TextField
                            {...commTextProps}
                            label="Client Secret"
                            error={!!error}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                        />
                    );
                },
            },
        ];

        return items;
    }, []);

    return (
        <div className="ms-int-config">
            <div className="ms-int-config__title">
                <h2>OpenAPI Configuration</h2>
                <Tooltip
                    arrow
                    placement="top"
                    title="API Key is used to authenticate with the server."
                    sx={{ ml: 0.5 }}
                >
                    <InfoOutlinedIcon />
                </Tooltip>
            </div>
            <div className="ms-int-config__body">
                <div className="status">
                    <h3>API Status</h3>
                    <Chip size="small" label="Waiting For Connection" />
                </div>
                <div className="form">
                    {formItems.map(props => (
                        <Controller<FormDataProps> key={props.name} {...props} control={control} />
                    ))}
                </div>
            </div>
            <Button variant="contained" sx={{ mt: 1 }}>
                Connect
            </Button>
        </div>
    );
};

export default Config;
