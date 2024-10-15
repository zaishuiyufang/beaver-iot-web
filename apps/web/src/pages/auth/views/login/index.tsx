import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { Paper, Typography, Button } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { Logo } from '@milesight/shared/src/components';
import useFormItems, { type FormDataProps } from '../useFormItems';
import './style.less';

export default () => {
    const { getIntlText } = useI18n();
    const { handleSubmit, control } = useForm<FormDataProps>();
    const formItems = useFormItems({ mode: 'login' });

    const onSubmit: SubmitHandler<FormDataProps> = data => console.log(data);

    return (
        <div className="ms-view-login">
            <Logo />
            <Paper className="ms-auth-container" elevation={3}>
                <Typography variant="h5" align="center">
                    {getIntlText('common.document.title')}
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
                    {getIntlText('common.label.login')}
                </Button>
            </Paper>
        </div>
    );
};
