import { useMemo, useState } from 'react';
import { useRequest } from 'ahooks';
import * as Icons from '@milesight/shared/src/components/icons';
import { useI18n } from '@milesight/shared/src/hooks';
import { awaitWrap, entityAPI, getResponseData, isRequestSuccess } from '@/services/http';
import RemainChart from './components/remain-chart';
import './style.less';

interface Props {
    config: any;
}
const View = (props: Props) => {
    const { config } = props;
    const { title, entity, metrics, time } = config || {};
    const { getIntlText } = useI18n();
    const [percent, setPercent] = useState(50);

    const { data: aggregateHistory } = useRequest(
        async () => {
            const { value: entityId } = entity || {};
            if (!entityId) return;

            const now = Date.now();
            const [error, resp] = await awaitWrap(
                entityAPI.getAggregateHistory({
                    entity_id: entityId,
                    aggregate_type: metrics,
                    start_timestamp: now - time,
                    end_timestamp: now,
                }),
            );
            if (error || !isRequestSuccess(resp)) return;

            return getResponseData(resp);
        },
        { refreshDeps: [entity, title, time, metrics] },
    );

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
                <div className="ms-icon-remaining__icon">
                    {Icon && <Icon sx={{ color: iconColor, fontSize: 24 }} />}
                    <div
                        className="ms-icon-remaining__icon-bg"
                        style={{ backgroundColor: iconColor }}
                    />
                </div>
                <div className="ms-icon-remaining__title">
                    <div className="ms-icon-remaining__title-label">{headerLabel}</div>
                    <div className="ms-icon-remaining__title-percent">{`${percent}%`}</div>
                </div>
            </div>
            <div className="ms-icon-remaining__chart">
                <RemainChart
                    draggable={false}
                    value={50}
                    onChange={percent => {
                        setPercent(percent);
                    }}
                    style={{
                        slider: {
                            bgColor: iconColor,
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default View;
