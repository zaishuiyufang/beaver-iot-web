import { forwardRef } from 'react';
import { RenderConfig } from '../../../render';
import config from '../config.json';

interface ConfigPluginProps {
    onOk: (data: any) => void;
}

const Plugin = forwardRef((props: ConfigPluginProps, ref: any) => {
    const { onOk } = props;

    const handleSubmit = (data: any) => {
        onOk(data);
    }

    return <RenderConfig config={config} onOk={handleSubmit} ref={ref} />
})

export default Plugin;
