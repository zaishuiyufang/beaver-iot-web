import * as MUI from '@mui/material';
import * as Milesight from '../components';
import { parseStyleString } from './util';

export interface IPlugin {
    /** 
     * 自定义组件配置 
     */
    config: CustomComponentProps;
}

const CreatPlugin = (props: IPlugin) => {
    const { config } = props;
    const currentTheme = 'default';

    return (
        <>
            {
                config.configProps?.map((item: any) => {
                    const { style: configStyle, components } = item;
                    const themeStyle = item?.theme?.[currentTheme].style ? parseStyleString(item?.theme?.[currentTheme].style) : undefined;
                    const className = item?.theme?.[currentTheme]?.class ? item?.theme?.[currentTheme]?.class : undefined;
                    return components?.map((component: ComponentProps) => {
                        const AllComponent: any = { ...Milesight, ...MUI };
                        if (AllComponent[component.type]) {
                            const Component = AllComponent[component.type];
                            const commonStyle = component?.style ? parseStyleString(component?.style) : undefined;
                            const { type, style, ...restItem } = component;
                            return (
                                <Component
                                    {...restItem}
                                    {...component.componentProps}
                                    key={component.type}
                                    sx={{ ...commonStyle, ...themeStyle }}
                                    style={configStyle ? parseStyleString(configStyle) : {}}
                                    className={className}
                                />
                            )
                        }
                    })
                })
            }
        </>
    )
}

export default CreatPlugin;