import { useEffect, useRef, useState } from 'react';
import components from '@/plugin/plugins/components';

const PLUGIN_DIR = '../../../plugin';

export default () => {
    const [pluginsConfigs, setPluginsConfigs] = useState<CustomComponentProps[]>([]);
    const pluginRef = useRef<CustomComponentProps[]>([]);

    const loopComponents = async (comName: string, index: number) => {
        const jsonPath = `${PLUGIN_DIR}/plugins/${comName}/config.json`;
        const jsonData = await import(jsonPath);

        let icon = null;
        if (jsonData?.icon) {
            const iconSrc = `${PLUGIN_DIR}/plugins/${comName}/icon.png`;
            icon = await import(iconSrc);
        }

        const isExit = pluginRef.current.some(item => item.name === jsonData.name);
        if (isExit) return;

        // 保证组件顺序稳定
        const plugins = pluginRef.current;
        pluginRef.current[index] = { ...jsonData?.default, iconSrc: icon };
        setPluginsConfigs(plugins.filter(Boolean));
    };

    const getPluginConfig = () => {
        components?.forEach(loopComponents);
    };

    useEffect(() => {
        getPluginConfig();
    }, []);

    return {
        pluginsConfigs,
    };
};
