import { useState } from 'react';
import { Grid, Typography } from '@mui/material';
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
        <div className="dashboard-plugin-class">
            <div className="dashboard-plugin-class-list">
                <Grid container spacing={2}>
                    {
                        pluginsConfigs?.map((pluginConfig: any) => {
                            return (
                                <Grid xs={3} className="dashboard-plugin-class-item">
                                    <div
                                        className="dashboard-plugin-class-item-content"
                                        onClick={() => handleClick(pluginConfig)}>
                                        <img className="dashboard-plugin-class-item-content-icon" src={pluginConfig.iconSrc?.default || pluginImg} />
                                        <Typography noWrap>{pluginConfig.name}</Typography >
                                    </div>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </div>
        </div>
    );
};


