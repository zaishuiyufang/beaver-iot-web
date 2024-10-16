import { OFFSET } from '../constant';

interface IProps {
    actualSliderRef: React.RefObject<HTMLDivElement>;
    clickSliderRef: React.RefObject<HTMLDivElement>;
}
export const useUpdate = ({ actualSliderRef, clickSliderRef }: IProps) => {
    const updatePercent = (percent: number) => {
        const actualSliderElement = actualSliderRef.current;
        if (!actualSliderElement) return;

        const clickSliderElement = clickSliderRef.current;
        if (!clickSliderElement) return;

        const rect = clickSliderElement.getBoundingClientRect();
        const { width } = rect;

        const distance = (percent / 100) * (width - OFFSET) + OFFSET;
        const xPercent = Math.ceil((distance / width) * 100);
        actualSliderElement.style.transform = `translateX(-${100 - xPercent}%)`;
    };

    return {
        updatePercent,
    };
};
