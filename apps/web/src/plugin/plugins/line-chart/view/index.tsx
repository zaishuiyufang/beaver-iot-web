import { useEffect } from 'react';
import Chart from 'chart.js/auto'; // 引入 Chart.js

import { useI18n } from '@milesight/shared/src/hooks';
import { useBasicChartEntity } from '@/plugin/hooks';

import styles from './style.module.less';

export interface ViewProps {
    config: {
        entity?: EntityOptionType[];
        title?: string;
        time: number;
    };
}

const View = (props: ViewProps) => {
    const { config } = props;
    const { entity, title, time } = config || {};

    const { getIntlText } = useI18n();
    const { chartShowData, chartLabels } = useBasicChartEntity({
        entity,
        time,
    });

    useEffect(() => {
        const chart = new Chart(document.getElementById('lineChart') as HTMLCanvasElement, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: chartShowData.map(chart => ({
                    label: chart.entityLabel,
                    data: chart.entityValues,
                    borderWidth: 1,
                    spanGaps: true,
                })),
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
    }, [entity, chartLabels, chartShowData]);

    return (
        <div className={styles['line-chart-wrapper']}>
            <div className={styles.name}>{title || getIntlText('common.label.title')}</div>

            <canvas id="lineChart" />
        </div>
    );
};

export default View;
