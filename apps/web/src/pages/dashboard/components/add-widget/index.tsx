import { useEffect, useState } from 'react';
import ConfigPlugin from '@/plugin/config-plugin';
import { WidgetDetail } from '@/services/http/dashboard';
import { useGetPluginConfigs } from '../../hooks';

interface WidgetProps {
    plugin: WidgetDetail;
    onCancel: () => void;
    onOk: (data: any) => void;
}

export default (props: WidgetProps) => {
    const { pluginsConfigs } = useGetPluginConfigs();
    const { plugin, onCancel, onOk } = props;
    const [config, setConfig] = useState<any>();

    useEffect(() => {
        const sourceJson = pluginsConfigs.find(item => item.type === plugin.data.type);
        setConfig({
            ...plugin,
            data: {
                ...plugin.data,
                ...sourceJson,
            },
        });
    }, [plugin, pluginsConfigs]);

    const handleClose = () => {
        setConfig(undefined);
        onCancel();
    };

    const handleChange = (data: any) => {
        setConfig({
            ...config,
            data: {
                ...(config?.data || {}),
                ...data,
            },
        });
    };

    const handleOk = (data: any) => {
        // TODO: 插件配置保存
        onOk({
            widget_id: plugin?.widget_id,
            tempId: config.data.tempId || new Date().getTime(),
            data: {
                ...config.data,
                config: data,
            },
        });
        handleClose();
    };

    return config ? (
        <ConfigPlugin
            onClose={handleClose}
            onOk={handleOk}
            config={config?.data}
            onChange={handleChange}
        />
    ) : null;
};
