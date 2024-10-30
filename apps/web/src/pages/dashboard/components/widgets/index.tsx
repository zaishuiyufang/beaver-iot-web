import { useCallback, useEffect } from 'react';
import { WidgetDetail } from '@/services/http/dashboard';
import Widget from './widget';

interface WidgetProps {
    parentRef: any;
    onChangeWidgets: (widgets: WidgetDetail[]) => void;
    widgets: WidgetDetail[];
    isEdit: boolean;
    onEdit: (data: WidgetDetail) => void;
}

const Widgets = (props: WidgetProps) => {
    const { widgets, onChangeWidgets, parentRef, isEdit, onEdit } = props;

    const moveBox = useCallback(
        ({ id, ...rest }: any) => {
            const index = widgets.findIndex((item: WidgetDetail) => item.widget_id === id);
            const newWidgets = [...widgets];
            newWidgets[index] = {
                ...newWidgets[index],
                data: {
                    ...(newWidgets[index].data || {}),
                    pos: {
                        ...newWidgets[index].data?.pos,
                        ...rest,
                    },
                },
            };
            onChangeWidgets(newWidgets);
        },
        [widgets],
    );

    // 计算新组件初始位置，排列在最后top最高的，left最大的右边，放不下另起一行
    const getInitPos = (data: WidgetType) => {
        const left = data.pos?.left;
        const top = data.pos?.top;
        if (widgets?.length === 1) return { left: 0, top: 0 };
        if (!left && !top && left !== 0 && top !== 0) {
            const isOverlapping = (newBox: any) => {
                return widgets.some(widget => {
                    const right = (widget.data.pos?.left || 0) + (widget.data.pos?.initWidth || 0);
                    const bottom = (widget.data.pos?.top || 0) + (widget.data.pos?.initHeight || 0);
                    // console.log(newBox, widget.data.pos, right, bottom);
                    return newBox.left <= right && newBox.top <= bottom;
                    // return !(
                    //     widget.pos?.left < newBox.right ||
                    //     right > newBox.left ||
                    //     widget.pos?.top < newBox.bottom ||
                    //     bottom > newBox.top
                    // );
                });
            };
            const findPosition = (width: number, height: number): any => {
                for (
                    let top = 0;
                    top < (parentRef?.current?.clientHeight || 0) - height;
                    top += 10
                ) {
                    for (
                        let left = 0;
                        left < (parentRef?.current?.clientWidth || 0) - width;
                        left += 10
                    ) {
                        const newBox = {
                            top,
                            left,
                            right: left + width,
                            bottom: top + height,
                        };
                        if (!isOverlapping(newBox)) {
                            return { top, left };
                        }
                    }
                }
                return {}; // No position found
            };
            const pos: any = findPosition(data.pos?.initWidth || 0, data.pos?.initHeight || 0);
            return pos;
        }
        return {
            left,
            top,
        };
    };

    const resizeBox = useCallback(
        ({ id, ...rest }: draggerType) => {
            const index = widgets.findIndex((item: WidgetDetail) => item.widget_id === id);
            const newWidgets = [...widgets];
            const unitHeight = (parentRef?.current?.clientHeight || 0) / 24;
            const unitWidth = (parentRef?.current?.clientWidth || 0) / 24;
            const width = Math.ceil((rest.width || 0) / unitWidth);
            const height = Math.ceil((rest.height || 0) / unitHeight);
            // const initWidth = newWidgets[index].pos?.initWidth
            //     ? newWidgets[index].pos?.initWidth
            //     : Math.ceil(rest.initWidth / unitWidth);
            // const initHeight = newWidgets[index].pos?.initHeight
            //     ? newWidgets[index].pos?.initHeight
            //     : Math.ceil(rest.initHeight / unitHeight);
            const initWidth = newWidgets[index].data?.pos?.initWidth || rest.initWidth || 0;
            const initHeight = newWidgets[index].data?.pos?.initHeight || rest.initHeight || 0;
            const curLeft = newWidgets[index].data?.pos?.left;
            const cueTop = newWidgets[index].data?.pos?.top;
            // TODO：计算太慢先注释
            // if (curLeft === undefined && cueTop === undefined) {
            //     const { left, top } = getInitPos({
            //         ...newWidgets[index],
            //         pos: {
            //             ...newWidgets[index].pos,
            //             ...rest,
            //             width,
            //             height,
            //             initWidth,
            //             initHeight,
            //             parentHeight: parentRef?.current?.clientHeight,
            //             parentWidth: parentRef?.current?.clientWidth,
            //         },
            //     });
            //     curLeft = left;
            //     cueTop = top;
            // }

            newWidgets[index] = {
                ...newWidgets[index],
                data: {
                    ...(newWidgets[index]?.data || {}),
                    pos: {
                        ...(newWidgets[index].data?.pos || {}),
                        ...rest,
                        width,
                        height,
                        left: curLeft || 0,
                        top: cueTop || 0,
                        initWidth,
                        initHeight,
                        parentHeight: parentRef?.current?.clientHeight,
                        parentWidth: parentRef?.current?.clientWidth,
                    },
                },
            };
            onChangeWidgets(newWidgets);
        },
        [widgets],
    );

    // 编辑组件
    const handleEdit = useCallback((data: WidgetDetail) => {
        onEdit(data);
    }, []);

    // 删除组件
    const handleDelete = useCallback(
        (data: WidgetDetail) => {
            const index = widgets.findIndex(
                (item: WidgetDetail) =>
                    item.widget_id === data.widget_id || item.tempId === data.tempId,
            );
            if (index > -1) {
                const newWidgets = [...widgets];
                newWidgets.splice(index, 1);
                onChangeWidgets(newWidgets);
            }
        },
        [widgets],
    );

    const resetWidgetsPos = useCallback(() => {
        // 遍历widgets并将pos按照窗口大小比例重新计算
        const newWidgets = widgets.map((item: WidgetDetail) => {
            // 根据当前窗口大小重新计算位置
            const leftRate = item.data.pos.left / item.data.pos.parentWidth;
            const topRate = item.data.pos.top / item.data.pos.parentHeight;
            const left = parentRef.current.clientWidth * leftRate;
            const top = parentRef.current.clientHeight * topRate;
            return {
                ...item,
                pos: {
                    ...item.data.pos,
                    top: top > 0 ? top : 0,
                    left: left > 0 ? left : 0,
                    parentWidth: parentRef.current.clientWidth,
                    parentHeight: parentRef.current.clientHeight,
                    // width: item.pos.width * (parentRef.current.clientWidth / item.pos.parentWidth),
                    // height:
                    //     item.pos.height * (parentRef.current.clientHeight / item.pos.parentHeight),
                },
            };
        });
        onChangeWidgets(newWidgets);
    }, [widgets]);

    useEffect(() => {
        window.addEventListener('resize', resetWidgetsPos);

        return () => {
            window.removeEventListener('resize', resetWidgetsPos);
        };
    }, [widgets]);

    return (
        <div>
            {widgets.map((data: WidgetDetail) => {
                return (
                    <Widget
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        data={data}
                        onResizeBox={resizeBox}
                        isEdit={isEdit}
                        onMove={moveBox}
                        parentRef={parentRef}
                    />
                );
            })}
        </div>
    );
};

export default Widgets;
