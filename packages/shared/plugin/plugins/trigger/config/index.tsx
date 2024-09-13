import RenderPlugin from '../../../render-plugin';
import config from './config.json';

const Plugin = () => {
    return <RenderPlugin config={config} />
}

export default Plugin;