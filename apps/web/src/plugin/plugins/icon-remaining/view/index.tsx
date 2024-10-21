import { useMemo, useState } from 'react';
import * as Icons from '@milesight/shared/src/components/icons';
import { useI18n } from '@milesight/shared/src/hooks';
import RemainChart from './components/remain-chart';
import './style.less';

interface Props {
    config: any;
}
const View = (props: Props) => {
    const { config } = props;
    const { title } = config || {};
    const { getIntlText } = useI18n();
    const [percent, setPercent] = useState(50);

    const headerLabel = title || getIntlText('common.label.title');
    const { Icon, iconColor } = useMemo(() => {
        const key = '0';
        const iconType = config?.[`${key}Icon`];
        const Icon = iconType && Icons[iconType as keyof typeof Icons];
        const iconColor = config?.[`${key}IconColor`];

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
