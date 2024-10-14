import { useState } from 'react';
import { Button, Tooltip, Chip, Switch, IconButton } from '@mui/material';
import cls from 'classnames';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useCopy } from '@milesight/shared/src/hooks';
import { InfoOutlinedIcon, ContentCopyIcon } from '@milesight/shared/src/components';
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
    const { handleCopy } = useCopy();
    const [webhookEnabled, setWebhookEnabled] = useState(false);
    const [OpenApiEnabled, setOpenApiEnabled] = useState(false);
    const formItems = useFormItems();
    const { control, handleSubmit } = useForm<FormDataProps>();
    const onSubmit: SubmitHandler<FormDataProps> = data => console.log(data);

    return (
        <>
            <div className="ms-int-config">
                <div className="ms-int-config__header">
                    <h2>OpenAPI Configuration</h2>
                    <Tooltip
                        title="API Key is used to authenticate with the server."
                        sx={{ ml: 0.5 }}
                    >
                        <InfoOutlinedIcon />
                    </Tooltip>
                </div>
                <div className="ms-int-config__body">
                    <div className="status">
                        <span className="status-label">API Status:</span>
                        <span className="status-value">
                            <Chip color="primary" label="Waiting For Connection" />
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
                        Connect
                    </Button>
                </div>
            </div>
            <div className="ms-int-service">
                <div className="ms-int-service__header">
                    <h2>Data Access Service</h2>
                </div>
                <div className="ms-int-service__body">
                    <div className="ms-service-card">
                        <div className="ms-service-card__header">
                            <Switch onChange={(_, checked) => setWebhookEnabled(checked)} />
                            <span className="title">Webhook</span>
                            <Tooltip
                                title="Receive the data pushed by Milesight Development Platform in real time via the Webhook service, and paste the URL address generated below, into the application from Milesight Development Platform."
                                sx={{ ml: 0.5 }}
                            >
                                <InfoOutlinedIcon />
                            </Tooltip>
                        </div>
                        <div className={cls('ms-service-card__body', { hidden: !webhookEnabled })}>
                            <div className="service-prop">
                                <span className="service-prop-label">Webhook Status:</span>
                                <span className="service-prop-value">
                                    <Chip color="success" label="Webhook ready" />
                                </span>
                            </div>
                            <div className="service-prop">
                                <span className="service-prop-label">Webhook URL:</span>
                                <span className="service-prop-value">
                                    <span>https://us.openapius.openapi.milesight.com</span>
                                    <IconButton
                                        sx={{ ml: 0.5 }}
                                        onClick={() =>
                                            handleCopy('https://us.openapius.openapi.milesight.com')
                                        }
                                    >
                                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="ms-service-card">
                        <div className="ms-service-card__header">
                            <Switch onChange={(_, checked) => setOpenApiEnabled(checked)} />
                            <span className="title">OpenAPI</span>
                            <Tooltip
                                title="Proactively pull device information and device telemetry data at regular intervals via OpenAPI."
                                sx={{ ml: 0.5 }}
                            >
                                <InfoOutlinedIcon />
                            </Tooltip>
                        </div>
                        <div className={cls('ms-service-card__body', { hidden: !OpenApiEnabled })}>
                            <div className="service-prop">
                                <span className="service-prop-label">Frequency of requests：</span>
                                <span className="service-prop-value">3600s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Config;
