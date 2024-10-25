import { useState } from 'react';
import { Grid } from '@mui/material';
import { WidgetDetail } from '@/services/http/dashboard';
import pluginImg from '@/assets/plugin.png';
import { useGetPluginConfigs } from '../../hooks';
import './style.less';

interface PluginListProps {
    onSelect: (plugin: WidgetDetail) => void;
}

export default (props: PluginListProps) => {
    const { onSelect } = props;
    const { pluginsConfigs } = useGetPluginConfigs();

    const handleClick = (type: WidgetDetail) => {
        onSelect(type);
    };

    return (
        <div className="dashboard-plugin-list">
            <Grid container>
                {pluginsConfigs?.map((pluginConfig: any) => {
                    return (
                        <Grid xs={3} className="dashboard-plugin-item">
                            <div
                                className="dashboard-plugin-item-content"
                                onClick={() => handleClick(pluginConfig)}
                            >
                                <img
                                    className="dashboard-plugin-item-content-icon"
                                    src={pluginConfig.iconSrc?.default || pluginImg}
                                    alt="plugin"
                                />
                                <span>{pluginConfig.name}</span>
                            </div>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
};
