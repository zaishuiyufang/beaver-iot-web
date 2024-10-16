import { isNil } from 'lodash-es';
import { Lightbulb as LightbulbIcon } from '@mui/icons-material';
import { Tooltip } from '@/components';
import type { ViewConfigProps } from './typings';
import './style.less';

interface Props {
    config: ViewConfigProps;
}

const View = (props: Props) => {
    const { config } = props;
    const { title, entity } = config || {};

    const renderTitle = title || 'Title';
    const renderIconColor = config?.busyIconColor;
    return (
        <div className="data-view">
            {!isNil(entity) && (
                <div className="data-view__icon">
                    <LightbulbIcon sx={{ color: renderIconColor || '#9B9B9B', fontSize: 24 }} />
                </div>
            )}
            <Tooltip className="data-view__title" autoEllipsis title={renderTitle} />
            <div className="data-view__container">
                <span className="data-view__content">{entity ? 'Busy' : '-'}</span>
            </div>
        </div>
    );
};

export default View;
