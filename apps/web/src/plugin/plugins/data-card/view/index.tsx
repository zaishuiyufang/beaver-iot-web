import { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { useI18n } from '@milesight/shared/src/hooks';
import * as Icons from '@milesight/shared/src/components/icons';
import { Tooltip } from '@/components';
import { awaitWrap, entityAPI, getResponseData, isRequestSuccess } from '@/services/http';
import type { ViewConfigProps } from '../typings';
import './style.less';

interface Props {
    config: ViewConfigProps;
}
const View = (props: Props) => {
    const { config } = props;
    const { title, entity } = config || {};
    const { getIntlText } = useI18n();
    const { data: entityStatusValue } = useRequest(
        async () => {
            if (!entity) return;
            const { value } = entity || {};

            const [error, resp] = await awaitWrap(entityAPI.getEntityStatus({ id: value }));
            if (error) return;

            if (error || !isRequestSuccess(resp)) return;
            return getResponseData(resp)?.value;
        },
        { refreshDeps: [entity] },
    );

    // 标题展示
    const headerLabel = title || getIntlText('common.label.title');
    // 当前实体实时数据
    const currentEntityData = useMemo(() => {
        const { rawData: currentEntity, value: entityValue } = entity || {};
        if (!currentEntity) return;

        // 获取当前选中实体
        const { entityValueAttribute } = currentEntity || {};
        const { enum: enumStruct, unit } = entityValueAttribute || {};
        const currentEntityStatus = entityStatusValue?.toString() || '';

        // 枚举类型
        if (enumStruct) {
            const currentKey = Object.keys(enumStruct).find(enumKey => {
                return enumKey === currentEntityStatus;
            });
            if (!currentKey) return;

            return {
                label: enumStruct[currentKey],
                value: currentKey,
            };
        }

        // 非枚举类型
        return {
            label: unit ? `${currentEntityStatus}${unit}` : `${currentEntityStatus}`,
            value: entityValue,
        };
    }, [entity, entityStatusValue]);
    // 当前实体图标
    const { Icon, iconColor } = useMemo(() => {
        const { value } = currentEntityData || {};
        const iconType = config?.[`Icon_${value}`];
        const Icon = iconType && Icons[iconType as keyof typeof Icons];
        const iconColor = config?.[`IconColor_${value}`];

        return {
            Icon,
            iconColor,
        };
    }, [config, currentEntityData]);

    return (
        <div className="data-view">
            {Icon && (
                <div className="data-view__icon">
                    <Icon sx={{ color: iconColor, fontSize: 24 }} />
                </div>
            )}
            <Tooltip className="data-view__title" autoEllipsis title={headerLabel} />
            <div className="data-view__container">
                <span className="data-view__content">{currentEntityData?.label || '-'}</span>
            </div>
        </div>
    );
};

export default View;
