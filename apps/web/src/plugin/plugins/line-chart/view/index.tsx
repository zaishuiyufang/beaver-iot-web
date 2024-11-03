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
    const { chartShowData, chartLabels, chartRef } = useBasicChartEntity({
        entity,
        time,
    });

    useEffect(() => {
        let chart: Chart<'line', (string | number | null)[], string> | null = null;
        if (chartRef.current) {
            chart = new Chart(chartRef.current, {
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
                    responsive: true, // 使图表响应式
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }

        return () => {
            /**
             * 清空图表数据
             */
            chart?.destroy();
        };
    }, [chartLabels, chartShowData, chartRef]);

    return (
        <div className={styles['line-chart-wrapper']}>
            <div className={styles.name}>{title || getIntlText('common.label.title')}</div>
            <div className={styles['line-chart-content']}>
                <canvas ref={chartRef} />
            </div>
        </div>
    );
};

export default View;
