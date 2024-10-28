import { Button, Tooltip, Chip } from '@mui/material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useI18n, useTheme } from '@milesight/shared/src/hooks';
import { InfoOutlinedIcon, toast } from '@milesight/shared/src/components';
import { entityAPI, awaitWrap, isRequestSuccess } from '@/services/http';
import { useEntity, type InteEntityType } from '../../hooks';
import Services from './services';
import useFormItems, { OPENAPI_KEYS, type FormDataProps } from './useFormItems';
import './style.less';

interface Props {
    /** 实体列表 */
    entities?: InteEntityType[];
}

/**
 * 集成配置组件
 */
const Config: React.FC<Props> = ({ entities }) => {
    const { getIntlText } = useI18n();
    const { blue, green } = useTheme();
    const { getEntityKey, getEntityValue } = useEntity({ entities });

    // ---------- 表单相关处理逻辑 ----------
    const formItems = useFormItems();
    const { control, handleSubmit, setValue } = useForm<FormDataProps>();
    const onSubmit: SubmitHandler<FormDataProps> = async params => {
        console.log(params);
        const finalParams =
            params &&
            Object.entries(params).reduce(
                (acc, [key, value]) => {
                    const entityKey = getEntityKey(key);

                    if (entityKey && value !== undefined) {
                        entityKey && (acc[entityKey] = value);
                    }
                    return acc;
                },
                {} as Record<string, any>,
            );

        console.log({ finalParams });
        if (!finalParams || !Object.keys(finalParams).length) {
            console.warn(`params is empty, the origin params is ${JSON.stringify(params)}`);
            return;
        }

        const [error, resp] = await awaitWrap(entityAPI.updateProperty({ exchange: finalParams }));
        if (error || !isRequestSuccess(resp)) return;

        toast.success({ content: getIntlText('common.message.operation_success') });
    };

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
            <Services entities={entities} />
        </>
    );
};

export default Config;
