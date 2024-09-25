import { RenderView } from '../../../render';
import configJson from '../config.json';
import { ViewConfigProps } from './typings';
import './style.less';

interface Props {
    config: ViewConfigProps;
}

const View = (props: Props) => {
    const { config } = props;

    return <RenderView config={config} configJson={configJson} />;
};

export default View;
