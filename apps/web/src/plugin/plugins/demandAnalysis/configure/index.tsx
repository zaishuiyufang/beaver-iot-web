import { RenderConfig } from '../../../render';
import config from '../config.json';

const Plugin = () => {
    return <RenderConfig config={config} />;
};

export default Plugin;
