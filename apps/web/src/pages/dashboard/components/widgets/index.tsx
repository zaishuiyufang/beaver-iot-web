import { useCallback, useEffect, useRef } from 'react';
import { cloneDeep } from 'lodash-es';
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
    const currentMoveWidgetRef = useRef<WidgetDetail>();

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

    // 开始移动组件事件
    const handleStartMove = useCallback(
        (id: ApiKey) => {
            // 开始移动时记录当前移动的组件
            currentMoveWidgetRef.current = widgets.find(
                (item: WidgetDetail) =>
                    (item.widget_id && item.widget_id === id) ||
                    (item.tempId && item.tempId === id),
            );
        },
        [widgets],
    );

    // 重叠判断
    const isOverlapping = (id: ApiKey, newBox: WidgetDetail) => {
        let isOver = false;
        widgets.forEach((widget: WidgetDetail) => {
            const widgetId = widget?.widget_id || widget?.tempId;
            // 如果已经重叠或者是自己，则直接返回
            if (isOver || widgetId === id) {
                return;
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

    // 结束移动组件事件
    const handleEndMove = useCallback(
        ({ id, ...rest }: any) => {
            const index = widgets.findIndex(
                (item: WidgetDetail) =>
                    (item.widget_id && item.widget_id === id) ||
                    (item.tempId && item.tempId === id),
            );
            const newWidgets = cloneDeep([...widgets]);
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
            const isOver = isOverlapping(id, newWidgets[index]);
            if (isOver) {
                newWidgets[index] = {
                    ...newWidgets[index],
                    data: {
                        ...(newWidgets[index].data || {}),
                        pos: {
                            ...newWidgets[index].data?.pos,
                            ...currentMoveWidgetRef.current?.data?.pos,
                        },
                    },
                };
                // 存在位置冲突则将位置恢复到开始拖拽的位置
                onChangeWidgets(newWidgets);
            }
            // 结束移动时清空当前移动的组件
            currentMoveWidgetRef.current = undefined;
        },
        [widgets],
    );

    const resizeBox = useCallback(
        ({ id, ...rest }: draggerType) => {
            const index = widgets.findIndex(
                (item: WidgetDetail) =>
                    (item.widget_id && item.widget_id === id) ||
                    (item.tempId && item.tempId === id),
            );
            const newWidgets = cloneDeep([...widgets]);
            const unitHeight = (parentRef?.current?.clientHeight || 0) / 24;
            const unitWidth = (parentRef?.current?.clientWidth || 0) / 24;
            let width = Math.ceil((rest.width || 0) / unitWidth);
            let height = Math.ceil((rest.height || 0) / unitHeight);
            const initWidth = newWidgets[index].data?.pos?.initWidth || rest.initWidth || 0;
            const initHeight = newWidgets[index].data?.pos?.initHeight || rest.initHeight || 0;
            const curLeft = newWidgets[index].data?.pos?.left;
            const cueTop = newWidgets[index].data?.pos?.top;
            if (width < newWidgets[index]?.data.minCol) {
                width = newWidgets[index].data.minCol;
            }
            if (width > newWidgets[index]?.data.maxCol) {
                width = newWidgets[index].data.maxCol;
            }
            if (height < newWidgets[index]?.data.minRow) {
                height = newWidgets[index].data.minRow;
            }
            if (height > newWidgets[index]?.data.maxRow) {
                height = newWidgets[index].data.maxRow;
            }
            if (width < 1) {
                width = 1;
            }
            if (height < 1) {
                height = 1;
            }
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
            if (isOverlapping(id, newWidgets[index])) {
                newWidgets[index] = { ...widgets[index] };
            }
            onChangeWidgets(newWidgets);
        },
        [widgets],
    );

    // 拖拉大小时判断是否与其他widget重叠
    const handleOverlapping = useCallback(
        ({ id, ...rest }: draggerType) => {
            const index = widgets.findIndex(
                (item: WidgetDetail) =>
                    (item.widget_id && item.widget_id === id) ||
                    (item.tempId && item.tempId === id),
            );
            const newWidgets = cloneDeep([...widgets]);
            const unitHeight = (parentRef?.current?.clientHeight || 0) / 24;
            const unitWidth = (parentRef?.current?.clientWidth || 0) / 24;
            let width = Math.floor((rest.width || 0) / unitWidth);
            let height = Math.floor((rest.height || 0) / unitHeight);
            const initWidth = newWidgets[index].data?.pos?.initWidth || rest.initWidth || 0;
            const initHeight = newWidgets[index].data?.pos?.initHeight || rest.initHeight || 0;
            const curLeft = newWidgets[index].data?.pos?.left;
            const cueTop = newWidgets[index].data?.pos?.top;
            if (width < newWidgets[index]?.data.minCol) {
                width = newWidgets[index].data.minCol;
            }
            if (width > newWidgets[index]?.data.maxCol) {
                width = newWidgets[index].data.maxCol;
            }
            if (height < newWidgets[index]?.data.minRow) {
                height = newWidgets[index].data.minRow;
            }
            if (height > newWidgets[index]?.data.maxRow) {
                height = newWidgets[index].data.maxRow;
            }
            if (width < 1) {
                width = 1;
            }
            if (height < 1) {
                height = 1;
            }
            // 高度和宽度加上容器的偏移量是否超出容易可视区域
            if ((rest.width || 0) + curLeft > parentRef?.current?.clientWidth) {
                return true;
            }
            if ((rest.height || 0) + cueTop > parentRef?.current?.clientHeight) {
                return true;
            }
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
            return isOverlapping(id, newWidgets[index]);
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
                    (item.widget_id && item.widget_id === data.widget_id) ||
                    (item.tempId && item.tempId === data.tempId),
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
                const id = (data.widget_id || data.tempId) as ApiKey;
                return (
                    <Widget
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        data={data}
                        onResizeBox={resizeBox}
                        isEdit={isEdit}
                        onMove={moveBox}
                        onStartMove={handleStartMove}
                        onEndMove={handleEndMove}
                        parentRef={parentRef}
                        isOverlapping={handleOverlapping}
                        key={id}
                    />
                );
            })}
        </div>
    );
};

export default Widgets;
