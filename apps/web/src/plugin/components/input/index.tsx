import { TextField, TextFieldProps } from '@mui/material';

type InputType = TextFieldProps;

const Input = (props: InputType) => {
    const { sx, title, ...rest } = props;
    return (
        <TextField
            {...rest}
            label={title}
            sx={{
                input: {
                    ...(sx as any),
                },
            }}
            InputLabelProps={{
                shrink: !!rest.value, // 当 value 不为空时，强制收缩标签
            }}
        />
    );
};

export default Input;
