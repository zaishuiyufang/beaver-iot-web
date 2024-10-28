import { useEffect } from 'react';
import Chart from 'chart.js/auto'; // 引入 Chart.js

import styles from './style.module.less';

export interface ViewProps {
    config: {
        entity?: string;
        widgetName?: string;
        time?: number;
    };
}

const View = (props: ViewProps) => {
    const { config } = props;
    const { entity, widgetName, time } = config || {};

    useEffect(() => {
        const chart = new Chart(document.getElementById('barChart') as HTMLCanvasElement, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                    {
                        label: entity || 'Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        borderWidth: 1,
                    },
                    {
                        label: 'hello',
                        data: [6, 18, 1, 26, 12, 7],
                        borderWidth: 1,
                    },
                    {
                        label: 'world',
                        data: [7, 2, 13, 15, 21, 8],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        return () => {
            /**
             * 清空图表数据
             */
            chart.destroy();
        };
    }, [entity]);

    return (
        <div className={styles['bar-chart-wrapper']}>
            <div className={styles.name}>
                {widgetName} {time}
            </div>

            <canvas id="barChart" />
        </div>
    );
};

export default View;
