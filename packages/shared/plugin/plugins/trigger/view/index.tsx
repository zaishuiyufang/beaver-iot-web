import { ViewConfigProps } from "./typings";
import './style.less';

interface Props {
    config: ViewConfigProps;
}

const View = (props: Props) => {
    const { config } = props;

    const handleService = () => {
        // 发送服务
    };

    return (
        <div className="trigger-view" onClick={handleService}>
            {!!config.showIcon && !!config.icon && <svg data-testid={config.icon}></svg>}
            {!!config.showTitle && (
                <div className={`trigger-view-title ${!config.showIcon ? 'not-icon' : ''}`}>{config.title}</div>
            )}
        </div>
    )
};

export default View;