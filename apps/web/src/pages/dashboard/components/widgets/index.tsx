import { useCallback, useEffect } from 'react';
import Widget from './widget';

interface WidgetProps {
    parentRef: any;
    onChangeWidgets: (widgets: any[]) => void;
    widgets: any[];
    isEdit: boolean;
    onEdit: (data: any) => void;
}

const Widgets = (props: WidgetProps) => {
    const { widgets, onChangeWidgets, parentRef, isEdit, onEdit } = props;

    const moveBox = useCallback(
        ({ id, ...rest }: any) => {
            const index = widgets.findIndex((item: any) => item.id === id);
            const newWidgets = [...widgets];
            newWidgets[index] = {
                ...newWidgets[index],
                pos: {
                    ...newWidgets[index].pos,
                    ...rest,
                },
            };
            onChangeWidgets(newWidgets);
        },
        [widgets],
    );

    const resizeBox = useCallback(
        ({ id, ...rest }: any) => {
            const index = widgets.findIndex((item: any) => item.id === id);
            const newWidgets = [...widgets];
            const unitHeight = (parentRef?.current?.clientHeight || 0) / 24;
            const unitWidth = (parentRef?.current?.clientWidth || 0) / 24;
            const width = Math.ceil(rest.width / unitWidth);
            const height = Math.ceil(rest.height / unitHeight);
            const initWidth = Math.ceil(rest.initWidth / unitWidth);
            const initHeight = Math.ceil(rest.initHeight / unitHeight);

            newWidgets[index] = {
                ...newWidgets[index],
                pos: {
                    ...newWidgets[index].pos,
                    ...rest,
                    width,
                    height,
                    initWidth,
                    initHeight,
                    parentHeight: parentRef?.current?.clientHeight,
                    parentWidth: parentRef?.current?.clientWidth,
                },
            };
            onChangeWidgets(newWidgets);
        },
        [widgets],
    );

    // 编辑组件
    const handleEdit = useCallback((data: any) => {
        onEdit(data);
    }, []);

    // 删除组件
    const handleDelete = useCallback((data: any) => {
        const index = widgets.findIndex((item: any) => item.id === data.id);
        const newWidgets = [...widgets];
        newWidgets.splice(index, 1);
        onChangeWidgets(newWidgets);
    }, []);

    const resetWidgetsPos = useCallback(() => {
        // 遍历widgets并将pos按照窗口大小比例重新计算
        const newWidgets = widgets.map((item: any) => {
            // 根据当前窗口大小重新计算位置
            const leftRate = item.pos.left / item.pos.parentWidth;
            const topRate = item.pos.top / item.pos.parentHeight;
            const left = parentRef.current.clientWidth * leftRate;
            const top = parentRef.current.clientHeight * topRate;
            return {
                ...item,
                pos: {
                    ...item.pos,
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
            {widgets.map((data: any) => {
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
