import { useCallback, useEffect, useRef, useState } from 'react';
import { DraggableResizable } from '@milesight/shared/src/components';
import plugins from '@/plugin/plugins';
import { RenderView } from '@/plugin/render';

interface WidgetProps {
    data: any;
    onResizeBox: ({ id, width, height }: any) => void;
}

const Widget = (props: WidgetProps) => {
    const { data, onResizeBox } = props;
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
        }
    }, [data.pos]);

    return (
        <DraggableResizable
            {...(pos || {})}
            onResize={onResizeBox}
            id={data.id}
            key={data.id}
            className="dashboard-content-widget"
        >
            {ComponentView ? (
                <div ref={widgetRef}>
                    <ComponentView config={data.config} />
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
