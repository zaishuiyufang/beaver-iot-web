import { useCallback, useEffect, useRef, useState } from 'react';
import {
    DeleteOutlineIcon as DeleteOutline,
    EditOutlinedIcon as EditOutlined,
} from '@milesight/shared/src/components';
import { DraggableResizable } from '@milesight/shared/src/components';
import plugins from '@/plugin/plugins';
import { RenderView } from '@/plugin/render';

interface WidgetProps {
    data: any;
    onResizeBox: (data: draggerType) => void;
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
    const [pos, setPos] = useState<draggerType>();

    const getSize = () => {
        // 计算出24等分一格大小
        const unitHeight = (parentRef?.current?.clientHeight || 0) / 24;
        const unitWidth = (parentRef?.current?.clientWidth || 0) / 24;
        return {
            unitHeight,
            unitWidth,
        };
    };

    useEffect(() => {
        if (!data?.pos?.width && !data?.pos?.height && widgetRef?.current) {
            onResizeBox({
                id: data.id,
                width: widgetRef?.current?.clientWidth,
                height: widgetRef?.current?.clientHeight,
                initWidth: widgetRef?.current?.clientWidth,
                initHeight: widgetRef?.current?.clientHeight,
            });
        } else {
            const { unitHeight, unitWidth } = getSize();
            let width = (data?.pos?.width || 0) * unitWidth;
            let height = (data?.pos?.height || 0) * unitHeight;
            if (width < data?.pos?.initWidth) {
                const diff = Math.ceil(((data?.pos?.initWidth || 0) - width) / unitWidth);
                width = ((data?.pos?.width || 0) + diff) * unitWidth;
            }
            if (height < data?.pos?.initHeight) {
                const diff = Math.ceil(((data?.pos?.initHeight || 0) - height) / unitHeight);
                height = ((data?.pos?.height || 0) + diff) * unitHeight;
            }
            setPos({
                ...(data.pos || {}),
                width,
                height,
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
            limitWidth={pos?.initWidth}
            limitHeight={pos?.initHeight}
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
