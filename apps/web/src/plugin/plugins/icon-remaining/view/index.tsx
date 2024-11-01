import { useMemo } from 'react';
import * as Icons from '@milesight/shared/src/components/icons';
import { useI18n } from '@milesight/shared/src/hooks';
import RemainChart from './components/remain-chart';
import { useSource } from './hooks';
import type { ViewConfigProps } from '../typings';
import './style.less';

interface Props {
    config: ViewConfigProps;
}
const View = (props: Props) => {
    const { config } = props;
    const { title, entity, metrics, time } = config || {};
    const { getIntlText } = useI18n();
    const { aggregateHistoryData } = useSource({ entity, metrics, time });

    // 百分比
    const percent = useMemo(() => {
        const { rawData } = entity || {};
        const { entityValueAttribute } = rawData || {};
        const { min, max } = entityValueAttribute || {};

        const { value } = aggregateHistoryData || {};
        if (!value) return 0;

        const range = (max || 0) - (min || 0);
        if (range === 0) return 100;
        if (!range) return 0;

        const percent = (value / range) * 100;
        return Math.min(100, Math.max(0, percent));
    }, [entity, aggregateHistoryData]);

    const headerLabel = title || getIntlText('common.label.title');
    const { Icon, iconColor } = useMemo(() => {
        const iconType = config?.icon;
        const Icon = iconType && Icons[iconType as keyof typeof Icons];
        const iconColor = config?.iconColor;

        return {
            Icon,
            iconColor,
        };
    }, [config]);

    return (
        <div className="ms-icon-remaining">
            <div className="ms-icon-remaining__header">
                <div>{headerLabel}</div>
            </div>
            <div className="ms-icon-remaining__content">
                <RemainChart Icon={Icon} iconColor={iconColor} percent={percent} />
            </div>
        </div>
    );
};

export default View;
