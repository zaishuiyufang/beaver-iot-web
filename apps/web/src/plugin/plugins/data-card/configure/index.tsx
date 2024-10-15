import { forwardRef } from 'react';
import { RenderConfig } from '../../../render';
import { useGetData } from './hooks/useGetData';

interface ConfigPluginProps {
    value: any;
    config: any;
    onOk: (data: any) => void;
    onChange: (data: any) => void;
}

const Plugin = forwardRef((props: ConfigPluginProps, ref: any) => {
    const { value, config, onOk, onChange } = props;
    const { customConfig } = useGetData({ config, value });

    const handleSubmit = (data: any) => {
        onOk(data);
    };

    return (
        <RenderConfig
            config={customConfig}
            onOk={handleSubmit}
            ref={ref}
            value={value}
            onChange={onChange}
        />
    );
});

export default Plugin;
