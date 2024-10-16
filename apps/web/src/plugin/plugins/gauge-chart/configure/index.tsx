import { forwardRef } from 'react';
import { RenderConfig } from '../../../render';
import config from '../config.json';

interface ConfigPluginProps {
    value: any;
    onOk: (data: any) => void;
}

const Plugin = forwardRef((props: ConfigPluginProps, ref: any) => {
    const { value, onOk } = props;

    const handleSubmit = (data: any) => {
        onOk(data);
    };

    return <RenderConfig config={config} onOk={handleSubmit} ref={ref} value={value} />;
});

export default Plugin;
