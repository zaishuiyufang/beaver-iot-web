import { useMemo } from 'react';
import { useI18n } from '@milesight/shared/src/hooks';
import * as Icons from '@milesight/shared/src/components/icons';
import { Tooltip } from '@/components';
import type { ViewConfigProps } from '../typings';
import './style.less';

interface Props {
    config: ViewConfigProps;
}
const key = '0';
const View = (props: Props) => {
    const { config } = props;
    const { title, entity } = config || {};
    const { getIntlText } = useI18n();

    const headerLabel = title || getIntlText('common.label.title');
    const { Icon, iconColor } = useMemo(() => {
        const iconType = config?.[`Icon_${key}`];
        const Icon = iconType && Icons[iconType as keyof typeof Icons];
        const iconColor = config?.[`IconColor_${key}`];

        return {
            Icon,
            iconColor,
        };
    }, [config]);

    const entityValue = useMemo(() => {
        const { rawData: currentEntity } = entity || {};
        // 获取当前选中实体
        if (!currentEntity) return null;

        const { entityValueAttribute } = currentEntity || {};
        const { enum: enumData, unit } = entityValueAttribute || {};

        if (enumData) {
            return Object.keys(enumData || {}).shift();
        }
        // TODO
        const value = 100;
        return unit ? `${value}${unit}` : `${value}`;
    }, [entity]);

    return (
        <div className="data-view">
            {Icon && (
                <div className="data-view__icon">
                    <Icon sx={{ color: iconColor, fontSize: 24 }} />
                </div>
            )}
            <Tooltip className="data-view__title" autoEllipsis title={headerLabel} />
            <div className="data-view__container">
                <span className="data-view__content">{entityValue || '-'}</span>
            </div>
        </div>
    );
};

export default View;
