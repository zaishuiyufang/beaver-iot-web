import { useCallback, useEffect, useRef, useState } from 'react';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { DraggableResizable } from '@milesight/shared/src/components';
import plugins from '@/plugin/plugins';
import { RenderView } from '@/plugin/render';

interface WidgetProps {
    data: any;
    onResizeBox: ({ id, width, height }: any) => void;
    onMove: ({ id, left, top }: { id?: string; left: number; top: number }) => void;
    isEdit: boolean;
    onEdit: (data: any) => void;
    onDelete: (data: any) => void;
    parentRef: any;
}

const Widget = (props: WidgetProps) => {
    const { data, onResizeBox, isEdit, onEdit, onDelete, onMove, parentRef } = props;
    const ComponentView = (plugins as any)[`${data.type}View`];
    const widgetRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState();

    useEffect(() => {
        if (!data?.pos?.width && !data?.pos?.height && widgetRef?.current) {
            setPos({
                ...(data.pos || {}),
                width: widgetRef?.current?.clientWidth,
                height: widgetRef?.current?.clientHeight,
            });
        } else {
            setPos({
                ...(data.pos || {}),
            });
        }
    }, [data]);

    const handleEdit = useCallback(() => {
        onEdit(data);
    }, [data]);

    const handleDelete = useCallback(() => {
        onDelete(data);
    }, [data]);

    return (
        <DraggableResizable
            {...(pos || {})}
            onResize={onResizeBox}
            onMove={onMove}
            id={data.id}
            key={data.id}
            isEdit={isEdit}
            parentRef={parentRef}
            className="dashboard-content-widget"
        >
            {isEdit && (
                <div className="dashboard-content-widget-icon">
                    <span className="dashboard-content-widget-icon-img" onClick={handleEdit}>
                        <EditOutlined />
                    </span>
                    <span className="dashboard-content-widget-icon-img" onClick={handleDelete}>
                        <DeleteOutline />
                    </span>
                </div>
            )}
            {ComponentView ? (
                <div ref={widgetRef}>
                    <ComponentView config={data.config} configJson={data} />
                </div>
            ) : (
                <div ref={widgetRef}>
                    <RenderView configJson={data} config={data.config} />
                </div>
            )}
        </DraggableResizable>
    );
};

export default Widget;
