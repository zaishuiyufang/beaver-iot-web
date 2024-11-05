import { Suspense, useCallback, useRef } from 'react';
import {
    DeleteOutlineIcon as DeleteOutline,
    EditOutlinedIcon as EditOutlined,
} from '@milesight/shared/src/components';
import plugins from '@/plugin/plugins';
import { RenderView } from '@/plugin/render';
import { WidgetDetail } from '@/services/http/dashboard';

interface WidgetProps {
    data: WidgetDetail;
    isEdit: boolean;
    onEdit: (data: WidgetDetail) => void;
    onDelete: (data: WidgetDetail) => void;
}

const Widget = (props: WidgetProps) => {
    const { data, isEdit, onEdit, onDelete } = props;
    const ComponentView = (plugins as any)[`${data.data.type}View`];
    const widgetRef = useRef<HTMLDivElement>(null);

    const handleEdit = useCallback(() => {
        onEdit(data);
    }, [data]);

    const handleDelete = useCallback(() => {
        onDelete(data);
    }, [data]);

    return (
        <div className="dashboard-content-widget">
            {isEdit && (
                <div
                    className={`dashboard-content-widget-icon ${isEdit ? 'dashboard-content-widget-icon-edit' : ''}`}
                >
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
                    {isEdit && (
                        <span
                            className="dashboard-custom-resizable-handle dashboard-custom-resizable-handle-se"
                            onClick={(e: any) => e.stopPropagation()}
                        />
                    )}
                </div>
            ) : (
                <div ref={widgetRef} className="dashboard-content-widget-main">
                    <RenderView configJson={data.data as any} config={data.data.config} />
                    {isEdit && (
                        <span
                            className="dashboard-custom-resizable-handle dashboard-custom-resizable-handle-se"
                            onClick={(e: any) => e.stopPropagation()}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Widget;
