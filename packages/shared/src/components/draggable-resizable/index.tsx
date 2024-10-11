import { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './style.less';

interface DraggableResizableBoxProps {
    // id: string;
    left?: number;
    top?: number;
    id?: string;
    className?: string;
    width?: number;
    height?: number;
    children: React.ReactNode;
    onResize: (data: any) => void;
}

const ItemType = 'BOX';

const DraggableResizableBox = ({
    // id,
    left,
    top,
    id,
    className,
    width,
    height,
    children,
    onResize,
}: DraggableResizableBoxProps) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id, left, top },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const style: React.CSSProperties = useMemo(() => {
        if (left !== undefined && top !== undefined) {
            return {
                position: 'absolute',
                left,
                top,
            };
        }
        return {
            position: 'absolute',
        };
    }, [left, top]);

    return (
        <ResizableBox
            width={width || 10}
            height={height || 10}
            minConstraints={[50, 50]}
            maxConstraints={[300, 300]}
            onResizeStop={(e: any, data: any) => {
                // 处理调整大小后的逻辑
                onResize({ ...data, id });
            }}
            handle={<span className="drag-resizable-handle" />}
            style={{
                ...style,
            }}
        >
            <div
                ref={drag}
                className={className}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isDragging ? 0.5 : 1,
                    zIndex: isDragging ? 10 : 1,
                    cursor: 'move',
                    ...style,
                }}
            >
                {children}
            </div>
        </ResizableBox>
    );
};

export default DraggableResizableBox;
