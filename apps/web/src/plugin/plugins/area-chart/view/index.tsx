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
    const { chartShowData, chartLabels, getBorderColor, getBackgroundColor } = useBasicChartEntity({
        entity,
        time,
    });

    useEffect(() => {
        const chart = new Chart(document.getElementById('areaChart') as HTMLCanvasElement, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: chartShowData.map((chart, index) => ({
                    label: chart.entityLabel,
                    data: chart.entityValues,
                    borderColor: getBorderColor(index),
                    backgroundColor: getBackgroundColor(index),
                    borderWidth: 1,
                    fill: true,
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
            chart?.destroy();
        };
    }, [chartShowData, chartLabels, getBackgroundColor, getBorderColor]);

    return (
        <div className={styles['area-chart-wrapper']}>
            <div className={styles.name}>{widgetName || getIntlText('common.label.title')}</div>

            <canvas id="areaChart" />
        </div>
    );
};

export default View;
