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
    const { entity, widgetName, time } = config;

    useEffect(() => {
        const chart = new Chart(document.getElementById('horizonBarChart') as HTMLCanvasElement, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                    {
                        label: entity || 'Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                indexAxis: 'y',
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
        <div className={styles['horizon-bar-chart-wrapper']}>
            <div className={styles.name}>
                {widgetName} {time}
            </div>

            <canvas id="horizonBarChart" />
        </div>
    );
};

export default View;
