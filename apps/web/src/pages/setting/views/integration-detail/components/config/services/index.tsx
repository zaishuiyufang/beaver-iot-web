import { useState } from 'react';
import { Button, Tooltip, Chip, Switch, IconButton } from '@mui/material';
import cls from 'classnames';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useI18n, useCopy, useTheme } from '@milesight/shared/src/hooks';
import { InfoOutlinedIcon, ContentCopyIcon } from '@milesight/shared/src/components';
import WebhookModal from './webhook-modal';
import OpenapiModal from './openapi-modal';
import '../style.less';

const Services = () => {
    const { getIntlText } = useI18n();
    const { handleCopy } = useCopy();
    const { blue, green } = useTheme();
    const [webhookEnabled, setWebhookEnabled] = useState(false);
    const [webhookModalVisible, setWebhookModalVisible] = useState(false);
    const [openApiEnabled, setOpenApiEnabled] = useState(false);
    const [openApiModalVisible, setOpenApiModalVisible] = useState(false);

    return (
        <div className="ms-int-service">
            <div className="ms-int-service__header">
                <h2>{getIntlText('setting.integration.data_access_service')}</h2>
            </div>
            <div className="ms-int-service__body">
                <div className="ms-service-card">
                    <div className="ms-service-card__header">
                        <Switch
                            size="small"
                            checked={webhookEnabled}
                            onChange={_ => setWebhookModalVisible(true)}
                        />
                        <span className="title">{getIntlText('common.label.webhook')}</span>
                        <Tooltip
                            title={getIntlText('setting.integration.webhook_helper_text')}
                            sx={{ ml: 0.5 }}
                        >
                            <InfoOutlinedIcon />
                        </Tooltip>
                    </div>
                    <div className={cls('ms-service-card__body', { hidden: !webhookEnabled })}>
                        <div className="service-prop">
                            <span className="service-prop-label">
                                {getIntlText('setting.integration.webhook_status')}
                                {getIntlText('common.symbol.colon')}
                            </span>
                            <span className="service-prop-value">
                                <Chip
                                    label={getIntlText('setting.integration.webhook_status_ready')}
                                    sx={{ bgcolor: green[200], color: 'success.main' }}
                                />
                                {/* <Chip
                                        label={getIntlText(
                                            'setting.integration.webhook_status_waiting',
                                        )}
                                        sx={{ bgcolor: blue[200], color: 'primary.main' }}
                                    /> */}
                            </span>
                        </div>
                        <div className="service-prop">
                            <span className="service-prop-label">
                                {getIntlText('setting.integration.webhook_url')}
                                {getIntlText('common.symbol.colon')}
                            </span>
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
                        <Switch
                            size="small"
                            checked={openApiEnabled}
                            onChange={_ => setOpenApiModalVisible(true)}
                        />
                        <span className="title">{getIntlText('common.label.openapi')}</span>
                        <Tooltip
                            title={getIntlText('setting.integration.openapi_helper_text')}
                            sx={{ ml: 0.5 }}
                        >
                            <InfoOutlinedIcon />
                        </Tooltip>
                    </div>
                    <div className={cls('ms-service-card__body', { hidden: !openApiEnabled })}>
                        <div className="service-prop">
                            <span className="service-prop-label">
                                {getIntlText('setting.integration.openapi_frequency_of_request')}
                                {getIntlText('common.symbol.colon')}
                            </span>
                            <span className="service-prop-value">3600s</span>
                        </div>
                    </div>
                </div>
            </div>
            <WebhookModal
                mode="edit"
                visible={webhookModalVisible}
                onCancel={() => setWebhookModalVisible(false)}
                onSuccess={() => {
                    setWebhookEnabled(true);
                    setWebhookModalVisible(false);
                }}
            />
            <OpenapiModal
                mode="edit"
                visible={openApiModalVisible}
                onCancel={() => setOpenApiModalVisible(false)}
                onSuccess={() => {
                    setOpenApiEnabled(true);
                    setOpenApiModalVisible(false);
                }}
            />
        </div>
    );
};

export default Services;
