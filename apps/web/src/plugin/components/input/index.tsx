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
        />
    );
};

export default Input;
