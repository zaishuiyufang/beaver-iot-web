import { useCallback, useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DraggableResizable } from '@milesight/shared/src/components';
import plugins from '@/plugin/plugins';
import { RenderView } from '@/plugin/render';

interface WidgetProps {
    parentRef: any;
    onChangeWidgets: (widgets: any[]) => void;
    widgets: any[];
}

type posType = {
    width: number;
    height: number;
    left?: number;
    top?: number;
};

const Widgets = (props: WidgetProps) => {
    const { widgets, onChangeWidgets } = props;
    const posRef = useRef<posType>({ width: 200, height: 200 });

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

    return (
        <div ref={drop}>
            {widgets.map((data: any) => {
                const ComponentView = (plugins as any)[`${data.type}View`];
                return (
                    <DraggableResizable
                        {...data.pos}
                        onResize={resizeBox}
                        id={data.id}
                        key={data.id}
                    >
                        {ComponentView ? (
                            <ComponentView config={data.config} />
                        ) : (
                            <RenderView configJson={data} config={data.config} />
                        )}
                    </DraggableResizable>
                );
            })}
        </div>
    );
};

export default Widgets;
