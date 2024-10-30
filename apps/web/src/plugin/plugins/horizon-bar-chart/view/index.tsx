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
        let chart: Chart<'bar', (string | number | null)[], string> | null = null;
        if (chartRef.current) {
            chart = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: chartLabels,
                    datasets: chartShowData.map(chart => ({
                        label: chart.entityLabel,
                        data: chart.entityValues,
                        borderWidth: 1,
                    })),
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
        }

        return () => {
            /**
             * 清空图表数据
             */
            chart?.destroy();
        };
    }, [chartLabels, chartShowData, chartRef]);

    return (
        <div className={styles['horizon-bar-chart-wrapper']}>
            <div className={styles.name}>{title || getIntlText('common.label.title')}</div>

            <canvas ref={chartRef} />
        </div>
    );
};

export default View;
