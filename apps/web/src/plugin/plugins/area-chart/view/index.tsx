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

const BORDER_COLORS = [
    'rgba(255, 99, 132, 1)', // 柔和的红色
    'rgba(54, 162, 235, 1)', // 柔和的蓝色
    'rgba(255, 206, 86, 1)', // 柔和的黄色
    'rgba(75, 192, 192, 1)', // 柔和的青色
    'rgba(153, 102, 255, 1)', // 柔和的紫色
];

const BACKGROUND_COLORS = [
    'rgba(255, 99, 132, 0.5)', // 柔和的红色
    'rgba(54, 162, 235, 0.5)', // 柔和的蓝色
    'rgba(255, 206, 86, 0.5)', // 柔和的黄色
    'rgba(75, 192, 192, 0.5)', // 柔和的青色
    'rgba(153, 102, 255, 0.5)', // 柔和的紫色
];

const View = (props: ViewProps) => {
    const { config } = props;
    const { entity, widgetName, time } = config;

    const { getIntlText } = useI18n();
    const { chartShowData, chartLabels } = useBasicChartEntity({
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
                    borderColor: BORDER_COLORS[index > 4 ? 0 : index],
                    backgroundColor: BACKGROUND_COLORS[index > 4 ? 0 : index],
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
            chart.destroy();
        };
    }, [chartShowData, chartLabels]);

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
