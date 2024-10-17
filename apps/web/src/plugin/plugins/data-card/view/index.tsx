import { useMemo } from 'react';
import * as Icons from '@milesight/shared/src/components/icons';
import { Tooltip } from '@/components';
import type { ViewConfigProps } from '../typings';
import './style.less';

interface Props {
    config: ViewConfigProps;
}

const View = (props: Props) => {
    const { config } = props;
    const { title, entity } = config || {};

    const headerLabel = title || 'Title';
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
        <div className="data-view">
            {Icon && (
                <div className="data-view__icon">
                    <Icon sx={{ color: iconColor, fontSize: 24 }} />
                </div>
            )}
            <Tooltip className="data-view__title" autoEllipsis title={headerLabel} />
            <div className="data-view__container">
                <span className="data-view__content">{entity ? 'Busy' : '-'}</span>
            </div>
        </div>
    );
};

export default View;
