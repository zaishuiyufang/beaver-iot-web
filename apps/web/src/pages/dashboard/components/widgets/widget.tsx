import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
    DeleteOutlineIcon as DeleteOutline,
    EditOutlinedIcon as EditOutlined,
    DraggableResizable,
} from '@milesight/shared/src/components';
import plugins from '@/plugin/plugins';
import { RenderView } from '@/plugin/render';
import { WidgetDetail } from '@/services/http/dashboard';

interface WidgetProps {
    data: WidgetDetail;
    onResizeBox: (data: draggerType) => void;
    onMove: ({ id, left, top }: { id: ApiKey; left: number; top: number }) => void;
    onStartMove: (id: ApiKey) => void;
    onEndMove: ({ id, left, top }: { id: ApiKey; left: number; top: number }) => void;
    isEdit: boolean;
    onEdit: (data: WidgetDetail) => void;
    onDelete: (data: WidgetDetail) => void;
    parentRef: any;
}

const Widget = (props: WidgetProps) => {
    const {
        data,
        onResizeBox,
        isEdit,
        onEdit,
        onDelete,
        onMove,
        onStartMove,
        onEndMove,
        parentRef,
    } = props;
    const ComponentView = (plugins as any)[`${data.data.type}View`];
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
        if (!data?.data.pos?.width && !data?.data.pos?.height && widgetRef?.current) {
            onResizeBox({
                id: data.widget_id as any,
                width: widgetRef?.current?.clientWidth,
                height: widgetRef?.current?.clientHeight,
                initWidth: widgetRef?.current?.clientWidth,
                initHeight: widgetRef?.current?.clientHeight,
            });
        } else {
            const { unitHeight, unitWidth } = getSize();
            const width = (data?.data.pos?.width || 0) * unitWidth;
            const height = (data?.data.pos?.height || 0) * unitHeight;
            // if (width < data?.data.pos?.initWidth) {
            //     const diff = Math.ceil(((data?.data.pos?.initWidth || 0) - width) / unitWidth);
            //     width = ((data?.data.pos?.width || 0) + diff) * unitWidth;
            // }
            // if (height < data?.data.pos?.initHeight) {
            //     const diff = Math.ceil(((data?.data.pos?.initHeight || 0) - height) / unitHeight);
            //     height = ((data?.data.pos?.height || 0) + diff) * unitHeight;
            // }
            setPos({
                ...(data.data.pos || {}),
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
            limitWidth={(data?.data.minCol || 0) * getSize().unitWidth}
            limitHeight={(data?.data.minRow || 0) * getSize().unitHeight}
            onResize={onResizeBox}
            onMove={onMove}
            onStartMove={onStartMove}
            onEndMove={onEndMove}
            id={(data.widget_id || data.tempId) as ApiKey}
            key={data.widget_id as any}
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
                <div ref={widgetRef} className="dashboard-content-widget-main">
                    <Suspense>
                        <ComponentView config={data.data.config} configJson={data.data} />
                    </Suspense>
                </div>
            ) : (
                <div ref={widgetRef} className="dashboard-content-widget-main">
                    <RenderView configJson={data.data as any} config={data.data.config} />
                </div>
            )}
        </DraggableResizable>
    );
};

export default Widget;
