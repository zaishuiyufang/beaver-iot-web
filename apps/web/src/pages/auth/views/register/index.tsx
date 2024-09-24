import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { Paper, Typography, Button } from '@mui/material';
import { Logo } from '@milesight/shared/src/components';
import useFormItems, { type FormDataProps } from '../useFormItems';
import './style.less';

export default () => {
    const { handleSubmit, control } = useForm<FormDataProps>();
    const formItems = useFormItems({ mode: 'register' });

    const onSubmit: SubmitHandler<FormDataProps> = data => console.log(data);

    return (
        <div className="ms-view-register">
            <Logo />
            <Paper className="ms-auth-container" elevation={3}>
                <Typography variant="h5" align="center">
                    IoT Solution Tools
                </Typography>
                <div className="ms-auth-form">
                    {formItems.map(props => (
                        <Controller<FormDataProps> key={props.name} {...props} control={control} />
                    ))}
                </div>
                <Button
                    fullWidth
                    sx={{ mt: 2.5, textTransform: 'none' }}
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                >
                    Confirm
                </Button>
            </Paper>
        </div>
    );
};
