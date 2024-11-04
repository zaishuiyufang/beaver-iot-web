import { useEffect } from 'react';
import Chart from 'chart.js/auto'; // 引入 Chart.js
import { useBasicChartEntity } from '@/plugin/hooks';
import { Tooltip } from '@/components';
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
                        fill: true,
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
    }, [chartShowData, chartLabels, chartRef]);

    return (
        <div className={styles['area-chart-wrapper']}>
            <Tooltip className={styles.name} autoEllipsis title={title} />
            <div className={styles['area-chart-content']}>
                <canvas ref={chartRef} />
            </div>
        </div>
    );
};

export default View;
