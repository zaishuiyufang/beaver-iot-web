import { useState } from 'react';
import * as Icons from '@milesight/shared/src/components/icons';
import RemainChart from './components/remain-chart';
import './style.less';

interface Props {
    config: any;
}
const View = (props: Props) => {
    const { config } = props;
    const { title, icon, iconColor } = config || {};
    const [percent, setPercent] = useState(50);

    const Icon = icon && Icons[icon as keyof typeof Icons];
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
                    <div className="ms-icon-remaining__title-label">{title}</div>
                    <div className="ms-icon-remaining__title-percent">{`${percent}%`}</div>
                </div>
            </div>
            <div className="ms-icon-remaining__chart" style={{ width: 215, height: 42 }}>
                <RemainChart
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
