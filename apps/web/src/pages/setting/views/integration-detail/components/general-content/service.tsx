import { useMemo, useEffect } from 'react';
import { Grid2, IconButton } from '@mui/material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import cls from 'classnames';
import { useI18n } from '@milesight/shared/src/hooks';
import { LoadingButton, ChevronRightIcon, toast } from '@milesight/shared/src/components';
import { useEntityFormItems, type EntityFormDataProps } from '@/hooks';
import { useConfirm, Tooltip } from '@/components';
import { entityAPI, awaitWrap, isRequestSuccess } from '@/services/http';
import { type InteEntityType } from '../../hooks';

interface Props {
    /** 实体列表 */
    entities?: InteEntityType[];

    /** 编辑成功回调 */
    onUpdateSuccess?: () => void;
}

/**
 * 属性实体渲染及操作组件
 */
const Service: React.FC<Props> = ({ entities, onUpdateSuccess }) => {
    const { getIntlText } = useI18n();
    const serviceEntities = useMemo(() => {
        return entities?.filter(item => item.type === 'SERVICE');
    }, [entities]);

    // ---------- 确认弹框相关处理逻辑 ----------
    // const { getEntityKey } = useEntity({ entities });
    const confirm = useConfirm();
    // const [modalOpen, setModalOpen] = useState(false);
    const handleConfirm = () => {
        confirm({
            title: getIntlText('setting.integration.function_data_sync_confirm_title'),
            description: getIntlText('setting.integration.function_data_sync_confirm_helper_text'),
            async onConfirm() {
                // const entityKey = getEntityKey(SYNC_DEVICE_KEY);
                // if (!entityKey) {
                //     console.warn('Entity key is not found');
                //     return;
                // }
                // const [error, resp] = await awaitWrap(
                //     entityAPI.callService({ exchange: { [entityKey]: {} } }),
                // );
                // if (error || !isRequestSuccess(resp)) return;
                // onUpdateSuccess?.();
                // toast.success({ content: getIntlText('common.message.operation_success') });
            },
        });
    };

    console.log({ serviceEntities });
    return (
        <div className="ms-tab-panel-service">
            <Grid2 container spacing={2}>
                <Grid2 size={{ sm: 6, md: 4, xl: 3 }}>
                    <div className="ms-int-feat-card" onClick={() => console.log('click')}>
                        <div className="header">
                            <Tooltip
                                autoEllipsis
                                className="title"
                                title="Query the historical data"
                            />
                            <IconButton sx={{ width: 24, height: 24 }}>
                                <ChevronRightIcon />
                            </IconButton>
                        </div>
                        <div className="desc">
                            This service is used to manually pull telemetry data reported by devices
                            to the Milesight Development Platform.
                        </div>
                    </div>
                </Grid2>
            </Grid2>
        </div>
    );
};

export default Service;
