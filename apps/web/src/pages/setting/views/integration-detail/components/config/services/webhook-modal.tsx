import React, { useMemo } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import cls from 'classnames';
import { TextField } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { flattenObject } from '@milesight/shared/src/utils/tools';
import { checkRequired, checkUrl } from '@milesight/shared/src/utils/validators';
import { Modal, type ModalProps } from '@milesight/shared/src/components';

export enum WEBHOOK_KEYS {
    /** Webhook 开关 关键字 */
    ENABLED_KEY = 'webhook.enabled',
    /** Webhook Url 关键字 */
    URL_KEY = 'webhook.url',
    /** Webhook 密钥 关键字 */
    SECRET_KEY = 'webhook.secret_key',
}

export type WebhookFormDataProps = Partial<Record<WEBHOOK_KEYS, string | boolean>>;

interface Props extends Omit<ModalProps, 'onOk'> {
    /**
     * 弹窗模式
     * @param edit 编辑
     * @param switch 开关
     */
    mode: 'edit' | 'switch';

    /** 表单提交回调 */
    onSubmit?: (params: WebhookFormDataProps) => void;
}

/**
 * Webhook 编辑弹窗
 */
const WebhookModal: React.FC<Props> = ({ mode, visible, onCancel, onSubmit }) => {
    const { getIntlText } = useI18n();
    const title = useMemo(() => {
        const subTitle = getIntlText('common.label.webhook');
        switch (mode) {
            case 'edit':
                return getIntlText('common.label.edit_title', { 1: subTitle });
            case 'switch':
                return getIntlText('common.label.enable_title', { 1: subTitle });
            default:
                return '';
        }
    }, [mode, getIntlText]);

    // ---------- 表单数据处理 ----------
    const { control, formState, handleSubmit, reset, setValue } = useForm<WebhookFormDataProps>();
    const onInnerSubmit: SubmitHandler<WebhookFormDataProps> = async formData => {
        await onSubmit?.({
            [WEBHOOK_KEYS.ENABLED_KEY]: true,
            ...flattenObject(formData),
        });
        reset();
    };

    return (
        <Modal
            title={title}
            visible={visible}
            onCancel={() => {
                reset();
                onCancel();
            }}
            onOk={handleSubmit(onInnerSubmit)}
        >
            <div className={cls('ms-inte-service-webhook', { loading: formState.isSubmitting })}>
                <Controller<WebhookFormDataProps>
                    name="webhook.url"
                    control={control}
                    rules={{
                        validate: { checkRequired: checkRequired(), checkUrl: checkUrl() },
                    }}
                    render={({ field: { onChange, value, disabled }, fieldState: { error } }) => {
                        return (
                            <TextField
                                required
                                fullWidth
                                size="small"
                                margin="dense"
                                label={getIntlText('setting.integration.webhook_url')}
                                error={!!error}
                                disabled={disabled}
                                helperText={error ? error.message : null}
                                value={value}
                                onChange={onChange}
                            />
                        );
                    }}
                />
                <Controller<WebhookFormDataProps>
                    name="webhook.secret_key"
                    control={control}
                    rules={{
                        validate: { checkRequired: checkRequired() },
                    }}
                    render={({ field: { onChange, value, disabled }, fieldState: { error } }) => {
                        return (
                            <TextField
                                required
                                fullWidth
                                size="small"
                                margin="dense"
                                label={getIntlText('setting.integration.webhook_secret_key')}
                                error={!!error}
                                disabled={disabled}
                                helperText={error ? error.message : null}
                                value={value}
                                onChange={onChange}
                            />
                        );
                    }}
                />
            </div>
        </Modal>
    );
};

export default WebhookModal;
