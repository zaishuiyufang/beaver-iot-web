import { useEffect, useState } from 'react';
import ConfigPlugin from '@/plugin/config-plugin';

interface SwigetProps {
    plugin: CustomComponentProps;
    onCancel: () => void;
    onOk: (data: any) => void;
}

export default (props: SwigetProps) => {
    const { plugin, onCancel, onOk } = props;
    const [config, setConfig] = useState<CustomComponentProps>();
    const [json, setJson] = useState('');

    useEffect(() => {
        setConfig(plugin);
    }, [plugin]);

    const handleClose = () => {
        setConfig(undefined);
        onCancel();
    };

    const handleOk = (data: any) => {
        // TODO: 插件配置保存
        onOk(data);
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


