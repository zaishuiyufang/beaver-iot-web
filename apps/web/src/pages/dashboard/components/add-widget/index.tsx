import { useEffect, useState } from 'react';
import { toast } from '@milesight/shared/src/components';
import ConfigPlugin from '@/plugin/config-plugin';
import { WidgetDetail } from '@/services/http/dashboard';
import { useGetPluginConfigs } from '../../hooks';

interface WidgetProps {
    plugin: WidgetDetail;
    widgets: WidgetDetail[];
    onCancel: () => void;
    onOk: (data: any) => void;
    parentRef: any;
}

export default (props: WidgetProps) => {
    const { pluginsConfigs } = useGetPluginConfigs();
    const { plugin, widgets, onCancel, onOk, parentRef } = props;
    const [config, setConfig] = useState<any>();
    console.log(widgets);
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

    // 重叠判断
    const isOverlapping = (newBox: WidgetDetail) => {
        let isOver = false;
        widgets.forEach((widget: WidgetDetail) => {
            // 如果已经重叠或者是自己，则直接返回
            if (isOver) {
                return true;
            }
            const unitHeight = (parentRef?.current?.clientHeight || 0) / 24;
            const unitWidth = (parentRef?.current?.clientWidth || 0) / 24;
            // 判断当前移动后的组件的位置是否在遍历到的组件的位置中
            const right = (widget.data.pos?.left || 0) + (widget.data.pos?.width || 0) * unitWidth;
            const bottom =
                (widget.data.pos?.top || 0) + (widget.data.pos?.height || 0) * unitHeight;
            const left = widget.data.pos?.left || 0;
            const top = widget.data.pos?.top || 0;
            const newLeft = newBox.data.pos?.left || 0;
            const newTop = newBox.data.pos?.top || 0;
            const newRight =
                (newBox.data.pos?.left || 0) + (newBox.data.pos?.width || 0) * unitWidth;
            const newBottom =
                (newBox.data.pos?.top || 0) + (newBox.data.pos?.height || 0) * unitHeight;
            if (!(newRight < left || newLeft > right || newBottom < top || newTop > bottom)) {
                isOver = true;
            }
        });
        return isOver;
    };

    // 计算新组件初始位置
    const getInitPos = (data: WidgetDetail) => {
        if (!widgets?.length) return { left: 0, top: 0 };
        const unitHeight = (parentRef?.current?.clientHeight || 0) / 24;
        const unitWidth = (parentRef?.current?.clientWidth || 0) / 24;
        const findPosition = (width: number, height: number): any => {
            for (
                let top = 0;
                top < (parentRef?.current?.clientHeight || 0) - height * unitHeight;
                top += unitHeight
            ) {
                for (
                    let left = 0;
                    left < (parentRef?.current?.clientWidth || 0) - width * unitWidth;
                    left += unitWidth
                ) {
                    const newData = {
                        ...data,
                        data: {
                            ...data.data,
                            pos: {
                                ...data.data.pos,
                                left,
                                top,
                            },
                        },
                    };
                    if (!isOverlapping(newData)) {
                        return { top, left };
                    }
                }
            }
            return {}; // No position found
        };
        const pos: any = findPosition(data.data.pos?.width || 0, data.data.pos?.height || 0);
        return pos;
    };

    const handleOk = (data: any) => {
        const widgetData = {
            widget_id: plugin?.widget_id,
            tempId: config.data.tempId || new Date().getTime(),
            data: {
                ...config.data,
                config: data,
                pos: {
                    width: config.data.minCol || 0,
                    height: config.data.minRow || 0,
                },
            },
        };
        const { left, top } = getInitPos(widgetData);
        handleClose();
        if (!left && !top && left !== 0 && top !== 0) {
            toast.error('当前位置无法放置widget，请调整后再添加');
            return;
        }
        // TODO: 插件配置保存
        onOk({
            ...widgetData,
            data: {
                ...widgetData.data,
                pos: {
                    ...widgetData.data.pos,
                    left,
                    top,
                },
            },
        });
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
