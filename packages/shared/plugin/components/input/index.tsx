import { TextField, TextFieldProps } from '@mui/material';

type InputType = TextFieldProps;

const Input = (props: InputType) => {
    const { sx, title, ...InputProps } = props;
    return (
        <TextField
            {...InputProps}
            label={title}
            sx={{
                input: {
                    ...(sx as any)
                }
            }}
        />
    )
}

export default Input;