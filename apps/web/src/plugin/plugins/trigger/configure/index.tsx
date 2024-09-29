import { forwardRef } from 'react';
import { RenderConfig } from '../../../render';
import config from '../config.json';

interface ConfigPluginProps {
    onOk: (data: any) => void;
}

const Plugin = forwardRef((props: ConfigPluginProps, ref: any) => {
    const { onOk } = props;

    const handleSumbit = (data: any) => {
        onOk(data);
    }

    return <RenderConfig config={config} onOk={handleSumbit} ref={ref} />
})

export default Plugin;