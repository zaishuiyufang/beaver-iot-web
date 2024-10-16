import { useEffect, useState } from 'react';
import ConfigPlugin from '@/plugin/config-plugin';

interface WidgetProps {
    plugin: CustomComponentProps;
    onCancel: () => void;
    onOk: (data: any) => void;
}

export default (props: WidgetProps) => {
    const { plugin, onCancel, onOk } = props;
    const [config, setConfig] = useState<CustomComponentProps>();

    useEffect(() => {
        setConfig(plugin);
    }, [plugin]);

    const handleClose = () => {
        setConfig(undefined);
        onCancel();
    };

    const handleOk = (data: any) => {
        // TODO: 插件配置保存
        onOk({
            ...config,
            id: config?.id || new Date().getTime(),
            config: data,
        });
        handleClose();
    };

    return config ? <ConfigPlugin onClose={handleClose} onOk={handleOk} config={config} /> : null;
};
