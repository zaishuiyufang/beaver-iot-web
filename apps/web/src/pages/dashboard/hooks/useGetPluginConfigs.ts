import { useEffect, useRef, useState } from 'react';
import components from '@/plugin/plugins/components';

const PLUGINDIR = '../../../plugin';

export default () => {
    const [pluginsConfigs, setPluginsConfigs] = useState<CustomComponentProps[]>([]);
    const pluginRef = useRef<CustomComponentProps[]>([]);

    const loopComponents = async (comName: string) => {
        const jsonPath = `${PLUGINDIR}/plugins/${comName}/config.json`;
        const jsonData = await import(jsonPath);
        let icon = undefined;
        if (jsonData?.icon) {
            const iconSrc = `${PLUGINDIR}/plugins/${comName}/icon.png`;
            icon = await import(iconSrc);
        }
        const isExit = pluginRef.current.some((item: any) => item.name === jsonData.name);
        if (isExit) {
            return;
        }
        setPluginsConfigs([
            ...pluginRef.current,
            { ...jsonData, iconSrc: icon }
        ]);
        pluginRef.current.push(jsonData);
    }

    const getPluginConfig = () => {
        components?.forEach(async (comName: any, index: number) => {
            if (index <= components.length - 1) {
                await loopComponents(comName);
            }
        })
    };

    useEffect(() => {
        getPluginConfig();
    }, []);

    return {
        pluginsConfigs
    }
}


