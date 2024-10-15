import { useCallback, useEffect, useRef, useState } from 'react';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
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
        // 计算当前宽度跟高度各占几格并向上取整
        const widthCol = Math.ceil((widgetRef?.current?.clientWidth || 0) / unitWidth);
        const heightRow = Math.ceil((widgetRef?.current?.clientHeight || 0) / unitHeight);
        return {
            widthCol,
            heightRow,
            unitHeight,
            unitWidth,
        };
    };

    useEffect(() => {
        if (!data?.pos?.width && !data?.pos?.height && widgetRef?.current) {
            // setPos({
            //     ...(data.pos || {}),
            //     width,
            //     height,
            //     initWidth: widgetRef?.current?.clientWidth,
            //     initHeight: widgetRef?.current?.clientHeight,
            // });
            onResizeBox({
                id: data.id,
                width: widgetRef?.current?.clientWidth,
                height: widgetRef?.current?.clientHeight,
                initWidth: widgetRef?.current?.clientWidth,
                initHeight: widgetRef?.current?.clientHeight,
            });
        } else {
            const { unitHeight, unitWidth } = getSize();
            setPos({
                ...(data.pos || {}),
                width: (data?.pos?.width || 0) * unitWidth,
                height: (data?.pos?.height || 0) * unitHeight,
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
