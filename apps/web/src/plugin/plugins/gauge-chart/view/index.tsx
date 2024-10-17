import { useEffect, useRef } from 'react';
import { useTheme } from '@milesight/shared/src/hooks';
import Chart from './gauge';

interface Props {
    config: any;
}
const extendArray = <T,>(arr: T[], n: number): T[] => {
    return Array.from({ length: n }, (_, i) => arr[i % arr.length]);
};

const View = (props: Props) => {
    const { config } = props;
    const { entity, title } = config || {};
    const chartRef = useRef<HTMLCanvasElement>(null);
    const { blue, green, red, yellow, grey } = useTheme();
    const colors = [blue[700], green[700], red[700], yellow[700]];

    const renderGaugeChart = (datasets: {
        data: number[];
        minValue?: number;
        currentValue: number;
    }) => {
        const ctx = chartRef.current!;
        if (!ctx) return;
        const { data, minValue, currentValue } = datasets || {};

        const bgColors = extendArray(colors, data.length);
        const chart = new Chart(ctx, {
            type: 'gauge',
            data: {
                datasets: [
                    {
                        data,
                        minValue,
                        value: currentValue,
                        backgroundColor: bgColors,
                    },
                ],
            },
            options: {
                needle: {
                    radiusPercentage: 3,
                    widthPercentage: 3.6,
                    lengthPercentage: 80,
                    color: grey[700],
                },
                //     valueLabel: {
                //         display: true,
                //         formatter: (value: number) => `$${Math.round(value)}`,
                //         color: 'rgba(255, 255, 255, 1)',
                //         backgroundColor: 'rgba(0, 0, 0, 1)',
                //         borderRadius: 5,
                //         padding: {
                //             top: 10,
                //             bottom: 10,
                //         },
                //     },
            },
        });
        return () => chart?.destroy();
    };

    useEffect(() => {
        // TODO
        const data = [1, 2, 3, 4];
        const minValue = 0;
        const currentValue = 2;

        return renderGaugeChart({ data, minValue, currentValue });
    }, [entity]);

    return (
        <div className="ms-gauge-chart">
            <h2>{title}</h2>
            <canvas id="gaugeChart" ref={chartRef} />
        </div>
    );
};

export default View;
