import React, { CSSProperties, useEffect } from 'react';
import { useRender, useUpdate } from './hooks';
import './style.less';

interface IProps {
    style?: {
        tooltip?: {
            fontSize?: number;
            bgColor?: string;
            offset?: number;
        };
        slider?: {
            bgColor?: string;
        };
    } & CSSProperties;
    value: number;
    draggable?: boolean;
    onChange?: (percent: number) => void;
}
export default React.memo(({ style, value, draggable, onChange }: IProps) => {
    const clickSliderRef = React.useRef<HTMLDivElement>(null);
    const actualSliderRef = React.useRef<HTMLDivElement>(null);
    const { tooltip, slider, width, height, ...rest } = style || {};
    const { fontSize, bgColor, offset } = tooltip || {};
    const { bgColor: sliderBgColor } = slider || {};

    const newValue = Math.min(100, Math.max(0, value || 0));
    const newStyle = {
        ...rest,
        width: width || '100%',
        height: height || '42px',
        '--remain-view-tooltip-font-size': `${fontSize || 12}px`,
        '--remain-view-tooltip-bg-color': bgColor || '#fff',
        '--remain-view-tooltip-position-top': `${offset ? -offset : -4}px`,
        '--remain-view-slider-bg-color': sliderBgColor || '#F7BA1E',
    };

    const { updatePercent } = useUpdate({ clickSliderRef, actualSliderRef });
    useRender({ clickSliderRef, draggable, updatePercent, onChange });

    useEffect(() => {
        updatePercent(newValue);
    }, [newValue]);

    return (
        <div className="ms-remain-chart" style={newStyle}>
            <div className="ms-remain-view">
                <div className="ms-remain-view__bg" />
                <div className="ms-remain-view__slider" ref={actualSliderRef} />
                <div className="ms-remain-view__event" ref={clickSliderRef} />
            </div>
            {/* <div className="ms-remain-tooltip">
                <span>50%</span>
            </div> */}
        </div>
    );
});
