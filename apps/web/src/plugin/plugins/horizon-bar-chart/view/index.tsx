import { useEffect } from 'react';
import Chart from 'chart.js/auto'; // 引入 Chart.js

import { useI18n } from '@milesight/shared/src/hooks';
import { useBasicChartEntity } from '@/plugin/hooks';

import styles from './style.module.less';

export interface ViewProps {
    config: {
        entity?: EntityOptionType[];
        widgetName?: string;
        time: number;
    };
}

const View = (props: ViewProps) => {
    const { config } = props;
    const { entity, widgetName, time } = config || {};

    const { getIntlText } = useI18n();
    const { chartShowData, chartLabels } = useBasicChartEntity({
        entity,
        time,
    });

    useEffect(() => {
        const chart = new Chart(document.getElementById('horizonBarChart') as HTMLCanvasElement, {
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

        return () => {
            /**
             * 清空图表数据
             */
            chart.destroy();
        };
    }, [entity, chartLabels, chartShowData]);

    return (
        <div className={styles['horizon-bar-chart-wrapper']}>
            <div className={styles.name}>{widgetName || getIntlText('common.label.title')}</div>

            <canvas id="horizonBarChart" />
        </div>
    );
};

export default View;
