import { forwardRef } from 'react';
import { RenderConfig } from '../../../render';
import config from '../config.json';

interface ConfigPluginProps {
    onOk: (data: any) => void;
    onChange: (data: any) => void;
    value: any;
}

const Plugin = forwardRef((props: ConfigPluginProps, ref: any) => {
    const { onOk, onChange, value } = props;

    const handleSubmit = (data: any) => {
        onOk(data);
    };

    return (
        <RenderConfig
            config={config}
            onOk={handleSubmit}
            ref={ref}
            onChange={onChange}
            value={value}
        />
    );
});

export default Plugin;
