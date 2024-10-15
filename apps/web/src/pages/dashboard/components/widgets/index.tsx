import { useCallback } from 'react';
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
