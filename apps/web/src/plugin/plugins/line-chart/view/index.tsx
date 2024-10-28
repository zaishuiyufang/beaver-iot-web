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
        const chart = new Chart(document.getElementById('lineChart') as HTMLCanvasElement, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'july'],
                datasets: [
                    {
                        label: entity || 'Monthly',
                        data: [12, 19, 3, 5, 2, 3, 16],
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
        <div className={styles['line-chart-wrapper']}>
            <div className={styles.name}>
                {widgetName} {time}
            </div>

            <canvas id="lineChart" />
        </div>
    );
};

export default View;
