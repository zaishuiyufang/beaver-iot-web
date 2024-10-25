import { useEffect, useState } from 'react';
import ConfigPlugin from '@/plugin/config-plugin';
import { WidgetDetail } from '@/services/http/dashboard';

interface WidgetProps {
    plugin: WidgetDetail;
    onCancel: () => void;
    onOk: (data: any) => void;
}

export default (props: WidgetProps) => {
    const { plugin, onCancel, onOk } = props;
    const [config, setConfig] = useState<any>();

    useEffect(() => {
        setConfig(plugin);
    }, [plugin]);

    const handleClose = () => {
        setConfig(undefined);
        onCancel();
    };

    const handleChange = (data: any) => {
        setConfig({ ...config, data });
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

    return config ? (
        <ConfigPlugin
            onClose={handleClose}
            onOk={handleOk}
            config={config.data}
            onChange={handleChange}
        />
    ) : null;
};
