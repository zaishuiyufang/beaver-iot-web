import { Button, Tooltip, Chip } from '@mui/material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useI18n, useTheme } from '@milesight/shared/src/hooks';
import { InfoOutlinedIcon } from '@milesight/shared/src/components';
import Services from './services';
import useFormItems from './useFormItems';
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
    const { getIntlText } = useI18n();
    const { blue, green } = useTheme();
    const formItems = useFormItems();
    const { control, handleSubmit } = useForm<FormDataProps>();
    const onSubmit: SubmitHandler<FormDataProps> = data => console.log(data);

    return (
        <>
            <div className="ms-int-config">
                <div className="ms-int-config__header">
                    <h2>{getIntlText('setting.integration.openapi_config')}</h2>
                    <Tooltip
                        title={getIntlText('setting.integration.openapi_config_helper_text')}
                        sx={{ ml: 0.5 }}
                    >
                        <InfoOutlinedIcon />
                    </Tooltip>
                </div>
                <div className="ms-int-config__body">
                    <div className="status">
                        <span className="status-label">
                            {getIntlText('setting.integration.api_status')}
                            {getIntlText('common.symbol.colon')}
                        </span>
                        <span className="status-value">
                            <Chip
                                label={getIntlText('setting.integration.api_status_waiting')}
                                sx={{ bgcolor: blue[200], color: 'primary.main' }}
                            />
                            {/* <Chip
                                label={getIntlText('setting.integration.api_status_ready')}
                                sx={{ bgcolor: green[200], color: 'success.main' }}
                            /> */}
                        </span>
                    </div>
                    <div className="form">
                        {formItems.map(props => (
                            <Controller<FormDataProps>
                                {...props}
                                key={props.name}
                                control={control}
                            />
                        ))}
                    </div>
                    <Button variant="contained" sx={{ mt: 1 }} onClick={handleSubmit(onSubmit)}>
                        {getIntlText('common.label.connect')}
                    </Button>
                </div>
            </div>
            <Services />
        </>
    );
};

export default Config;
