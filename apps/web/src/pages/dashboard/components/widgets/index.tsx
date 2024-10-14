import { useCallback } from 'react';
import { useDrop } from 'react-dnd';
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

    const moveBox = useCallback((id: string, left: number, top: number) => {
        const index = widgets.findIndex((item: any) => item.id === id);
        const newWidgets = [...widgets];
        newWidgets[index] = {
            ...newWidgets[index],
            left,
            top,
        };
        onChangeWidgets(newWidgets);
    }, []);

    const resizeBox = useCallback(({ id, width, height }: any) => {
        const index = widgets.findIndex((item: any) => item.id === id);
        const newWidgets = [...widgets];
        newWidgets[index] = {
            ...newWidgets[index],
            width,
            height,
        };
        onChangeWidgets(newWidgets);
    }, []);

    const [, drop] = useDrop({
        accept: 'BOX',
        drop(item: any, monitor: any) {
            const delta = monitor.getDifferenceFromInitialOffset();
            const left = Math.round(item.left + delta.x);
            const top = Math.round(item.top + delta.y);
            moveBox(item.id, left, top);
            return undefined;
        },
    });

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

    return (
        <div ref={drop}>
            {widgets.map((data: any) => {
                return (
                    <Widget
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        data={data}
                        onResizeBox={resizeBox}
                        isEdit={isEdit}
                    />
                );
            })}
        </div>
    );
};

export default Widgets;
