import { useState } from 'react';
import { Grid } from '@mui/material';
import { useGetPluginConfigs } from '../../hooks';
import pluginImg from '@/assets/plugin.png';
import './style.less';

interface PluginListProps {
    onSelect: (plugin: CustomComponentProps) => void;
}

export default (props: PluginListProps) => {
    const { onSelect } = props;
    const { pluginsConfigs } = useGetPluginConfigs();

    const handleClick = (type: CustomComponentProps) => {
        onSelect(type);
    };

    return (
        <div className="dashboard-plugin-list">
            <Grid container spacing={2}>
                {
                    pluginsConfigs?.map((pluginConfig: any) => {
                        return (
                            <Grid xs={3} className="dashboard-plugin-item">
                                <div
                                    className="dashboard-plugin-item-content"
                                    onClick={() => handleClick(pluginConfig)}>
                                    <img className="dashboard-plugin-item-content-icon" src={pluginConfig.iconSrc?.default || pluginImg} />
                                    {pluginConfig.name}
                                </div>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
    );
};


