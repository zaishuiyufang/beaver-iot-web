import { useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
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
    isEdit: boolean;
    children: React.ReactNode;
    onResize: (data: any) => void;
    onMove: ({ id, left, top }: { id?: string; left: number; top: number }) => void;
    /**
     * 拖拽相对的元素
     */
    parentRef: any;
}

const DraggableResizableBox = ({
    left,
    top,
    id,
    className,
    width,
    height,
    isEdit,
    children,
    onResize,
    onMove,
    parentRef,
}: DraggableResizableBoxProps) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'BOX',
        item: { id },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const ref = useRef<any>(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    const [, drop] = useDrop({
        accept: 'BOX',
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

    drag(drop(ref));

    return (
        <ResizableBox
            width={width || 10}
            height={height || 10}
            minConstraints={[50, 50]}
            maxConstraints={[600, 300]}
            onResizeStop={(e: any, data: any) => {
                // 处理调整大小后的逻辑
                onResize({ ...data.size, id });
            }}
            resizeHandles={isEdit ? ['se'] : []} // 动态设置是否可调整大小
            handle={<span className="drag-resizable-handle" />}
            style={{ ...style }}
        >
            <div
                ref={isEdit ? ref : undefined}
                className={className}
                draggable={isEdit}
                onDragStart={(e: any) => {
                    e.stopPropagation();
                    const img = new Image();
                    img.src = '';
                    e.dataTransfer.setDragImage(img, 0, 0);
                    const offset = ref.current?.getBoundingClientRect?.();
                    offsetRef.current = {
                        x: e.pageX - offset.left,
                        y: e.pageY - offset.top,
                    };
                }}
                onDrag={(e: any) => {
                    e.preventDefault();
                    const parentOffset = parentRef.current?.getBoundingClientRect?.();
                    let left = e.pageX - parentOffset.left - offsetRef.current.x;
                    let top = e.pageY - parentOffset.top - offsetRef.current.y;
                    if (!isEdit) {
                        return;
                    }
                    if (e.pageX === 0 && e.pageY === 0) {
                        return;
                    }
                    if (left < 0) {
                        left = 0;
                    }
                    if (top < 0) {
                        top = 0;
                    }
                    if (left > parentRef.current.clientWidth - ref.current.clientWidth) {
                        left = parentRef.current.clientWidth - ref.current.clientWidth;
                    }
                    if (top > parentRef.current.clientHeight - ref.current.clientHeight) {
                        top = parentRef.current.clientHeight - ref.current.clientHeight;
                    }
                    onMove({
                        id,
                        left,
                        top,
                    });
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // opacity: isDragging ? 0.5 : 1,
                    zIndex: isDragging ? 10 : 1,
                    cursor: isEdit ? 'move' : 'auto',
                    left: 0,
                    top: 0,
                }}
            >
                {children}
            </div>
        </ResizableBox>
    );
};

export default DraggableResizableBox;
