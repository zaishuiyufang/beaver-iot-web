import { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { COMPONENTCLASS } from '@/plugin/constant';
import pluginImg from '@/assets/plugin.png';
import { useGetPluginConfigs } from '../../hooks';
import './style.less';

interface PluginListProps {
    onSelect: (plugin: CustomComponentProps) => void;
}

export default (props: PluginListProps) => {
    const { getIntlText } = useI18n();
    const { onSelect } = props;
    const { pluginsConfigs } = useGetPluginConfigs();
    const [pluginList, setPluginList] = useState<Record<string, any>>();

    useEffect(() => {
        console.log(pluginsConfigs);
        if (pluginsConfigs) {
            const pluginClass: Record<string, any> = COMPONENTCLASS;
            const plugins: Record<string, any> = {};
            Object.keys(pluginClass).forEach((plu: any) => {
                plugins[plu] = {
                    ...pluginClass[plu],
                };
            });
            pluginsConfigs.forEach((plugin: CustomComponentProps) => {
                if (plugin.class && plugins[plugin.class]) {
                    if (!plugins[plugin.class].list) {
                        plugins[plugin.class].list = [];
                    }
                    plugins[plugin.class].list.push(plugin);
                } else {
                    const className = 'other';
                    if (!plugins[className].list) {
                        plugins[className].list = [];
                    }
                    plugins[className].list.push(plugin);
                }
            });
            setPluginList(plugins);
        }
    }, [pluginsConfigs]);

    const handleClick = (type: CustomComponentProps) => {
        onSelect(type);
    };

    return (
        <div className="dashboard-plugin-class">
            <div className="dashboard-plugin-class-list">
                <Grid container>
                    {pluginList
                        ? Object.keys(pluginList).map((pluginClass: string) => {
                              return (
                                  <div className="dashboard-plugin-class-grid">
                                      <div className="dashboard-plugin-class-grid-title">
                                          {getIntlText(pluginList[pluginClass].name)}
                                      </div>
                                      {pluginList[pluginClass]?.list?.map((pluginConfig: any) => {
                                          return (
                                              <Grid xs={3} className="dashboard-plugin-class-item">
                                                  <div
                                                      className="dashboard-plugin-class-item-content"
                                                      onClick={() => handleClick(pluginConfig)}
                                                  >
                                                      <img
                                                          className="dashboard-plugin-class-item-content-icon"
                                                          src={
                                                              pluginConfig.iconSrc?.default ||
                                                              pluginImg
                                                          }
                                                          alt="plugin"
                                                      />
                                                      <Typography noWrap>
                                                          {pluginConfig.name}
                                                      </Typography>
                                                  </div>
                                              </Grid>
                                          );
                                      })}
                                  </div>
                              );
                          })
                        : null}
                </Grid>
            </div>
        </div>
    );
};
