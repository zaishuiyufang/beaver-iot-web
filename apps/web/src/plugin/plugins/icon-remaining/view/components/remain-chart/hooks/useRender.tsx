import { useEffect } from 'react';
import { OFFSET } from '../constant';

interface IProps {
    clickSliderRef: React.RefObject<HTMLDivElement>;
    draggable?: boolean;
    onChange?: (percent: number) => void;
    updatePercent: (percent: number) => void;
}
export const useRender = ({ clickSliderRef, draggable, onChange, updatePercent }: IProps) => {
    const clickSliderListener = () => {
        const clickSliderElement = clickSliderRef.current;
        if (!clickSliderElement) return;

        let isMouseDown = false;
        const onMouseDown = () => {
            isMouseDown = true;
        };
        const onMouseMove = (event: MouseEvent) => {
            if (!isMouseDown) return;

            updateSliderPosition(event);
        };
        const onMouseUp = (event: MouseEvent) => {
            if (!isMouseDown) return;

            isMouseDown = false;
            const percent = updateSliderPosition(event);
            onChange && onChange(percent || 0);
        };
        const updateSliderPosition = (event: MouseEvent) => {
            const { clientX } = event;

            const rect = clickSliderElement.getBoundingClientRect();
            const { left: startX, width } = rect;
            const diffX = clientX - startX;

            const distance = Math.min(Math.max(diffX, OFFSET), width);
            const percent = Math.ceil(((distance - OFFSET) / (width - OFFSET)) * 100);

            updatePercent(percent);

            return percent;
        };

        clickSliderElement.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            clickSliderElement.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    };
    useEffect(() => {
        if (!draggable) return;

        return clickSliderListener();
    }, [draggable]);
};
