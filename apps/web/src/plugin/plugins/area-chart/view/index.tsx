import { useEffect } from 'react';
import Chart from 'chart.js/auto'; // 引入 Chart.js

import { useI18n } from '@milesight/shared/src/hooks';

import type { EntityOptionType } from '@/plugin/components/entity-select';

import styles from './style.module.less';

export interface ViewProps {
    config: {
        entity?: EntityOptionType;
        widgetName?: string;
        time?: number;
    };
}

const View = (props: ViewProps) => {
    const { config } = props;
    const { entity, widgetName, time } = config;

    const { getIntlText } = useI18n();

    useEffect(() => {
        const chart = new Chart(document.getElementById('areaChart') as HTMLCanvasElement, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: entity?.label || 'Monthly',
                        data: [12, -19, 3, 5, -2, 3, 16],
                        borderColor: '#3491FA',
                        backgroundColor: 'rgba(176, 211, 255, 0.5)',
                        borderWidth: 1,
                        fill: true,
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
        <div className={styles['area-chart-wrapper']}>
            <div className={styles.name}>
                {widgetName || getIntlText('common.label.title')} {time}
            </div>

            <canvas id="areaChart" />
        </div>
    );
};

export default View;
