import { useEffect, useState } from 'react';
import ConfigPlugin from '@/plugin/config-plugin';

const PLUGINDIR = '../../../../plugin';

interface SwigetProps {
    plugin: CustomComponentProps;
}

export default (props: SwigetProps) => {
    const { plugin } = props;
    const [config, setConfig] = useState<CustomComponentProps>();
    const [json, setJson] = useState('');

    useEffect(() => {
        setConfig(plugin);
    }, [plugin]);

    // const showPlugin = async () => {
    //     const jsonPath = `${PLUGINDIR}/plugins/${type}/config.json`;
    //     const jsonData = await import(jsonPath);
    //     setConfig(jsonData.default);
    // };

    const handleClose = () => {
        setConfig(undefined);
    };

    const handleOk = () => {
        // TODO: 插件配置保存
    }

    const handleCreatPlugin = () => {
        if (json) {
            try {
                const configJson = JSON.parse(json);
                setConfig(configJson);
            } catch (error) {
                console.error('json不合法');
            }
        }
    };

    return !!config && <ConfigPlugin onClose={handleClose} onOk={handleOk} config={config} />
};


