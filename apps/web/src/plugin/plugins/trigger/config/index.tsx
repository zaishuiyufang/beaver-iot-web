import { RenderConfig } from '../../../render';
import config from '../set.json';

const Plugin = () => {
    return <RenderConfig config={config} />
}

export default Plugin;