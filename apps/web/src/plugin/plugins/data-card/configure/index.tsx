import { forwardRef, useEffect, useRef, useState } from 'react';
import { RenderConfig } from '../../../render';
import { useInitialize, useDynamic } from './hooks';
import type { IConfig, IEntity, ViewConfigProps } from '../typings';

interface ConfigPluginProps {
    value: ViewConfigProps;
    config: IConfig;
    onOk: (data: any) => void;
    onChange: (data: any) => void;
}

const Plugin = forwardRef((props: ConfigPluginProps, ref: any) => {
    const { value, config, onOk, onChange } = props;
    const entityMapRef = useRef<{ [key: string]: IEntity }>({});
    const [customConfig, setCustomConfig] = useState(config);
    useInitialize({ config: customConfig, setConfig: setCustomConfig, entityMapRef });
    useDynamic({ config: customConfig, setConfig: setCustomConfig, entityMapRef, value });

    useEffect(() => {
        setCustomConfig(config);
    }, [config]);

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
