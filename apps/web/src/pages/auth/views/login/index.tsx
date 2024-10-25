import { useNavigate } from 'react-router-dom';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { Paper, Typography, Button } from '@mui/material';
import { oauthClientID, oauthClientSecret } from '@milesight/shared/src/config';
import { useI18n } from '@milesight/shared/src/hooks';
import { Logo } from '@milesight/shared/src/components';
import { iotLocalStorage, TOKEN_CACHE_KEY } from '@milesight/shared/src/utils/storage';
import { globalAPI, awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';
import useFormItems, { type FormDataProps } from '../useFormItems';
import './style.less';

export default () => {
    const navigate = useNavigate();
    const { getIntlText } = useI18n();
    const { handleSubmit, control } = useForm<FormDataProps>();
    const formItems = useFormItems({ mode: 'login' });

    const onSubmit: SubmitHandler<FormDataProps> = async data => {
        const { email, password } = data;
        const [error, resp] = await awaitWrap(
            globalAPI.oauthLogin({
                grant_type: 'password',
                username: email,
                password,
                client_id: oauthClientID,
                client_secret: oauthClientSecret,
            }),
        );
        const respData = getResponseData(resp);

        // console.log({ error, resp });
        if (error || !respData || !isRequestSuccess(resp)) return;
        // 每 60 分钟刷新一次 token
        const result = { ...respData, expires_in: Date.now() + 60 * 60 * 1000 };

        navigate('/');
        iotLocalStorage.setItem(TOKEN_CACHE_KEY, result);
    };

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
