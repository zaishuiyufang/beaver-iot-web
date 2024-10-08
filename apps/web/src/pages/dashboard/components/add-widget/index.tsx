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
    };

    return config ? <ConfigPlugin onClose={handleClose} onOk={handleOk} config={config} /> : null;
};
