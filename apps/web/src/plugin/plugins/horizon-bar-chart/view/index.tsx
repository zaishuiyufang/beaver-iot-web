import React, { useEffect } from 'react';
import Chart from 'chart.js/auto'; // 引入 Chart.js
import { useBasicChartEntity } from '@/plugin/hooks';
import { getChartColor } from '@/plugin/utils';
import { Tooltip } from '@/plugin/view-components';
import styles from './style.module.less';

export interface ViewProps {
    config: {
        entity?: EntityOptionType[];
        title?: string;
        time: number;
    };
    configJson: {
        isPreview?: boolean;
    };
}

const View = (props: ViewProps) => {
    const { config, configJson } = props;
    const { entity, title, time } = config || {};
    const { isPreview } = configJson || {};
    const { chartShowData, chartLabels, chartRef } = useBasicChartEntity({
        entity,
        time,
        isPreview,
    });

    useEffect(() => {
        try {
            let chart: Chart<'bar', (string | number | null)[], string> | null = null;
            const resultColor = getChartColor(chartShowData);
            if (chartRef.current) {
                chart = new Chart(chartRef.current, {
                    type: 'bar',
                    data: {
                        labels: chartLabels,
                        datasets: chartShowData.map((chart: any, index: number) => ({
                            label: chart.entityLabel,
                            data: chart.entityValues,
                            borderWidth: 1,
                            backgroundColor: resultColor[index],
                        })),
                    },
                    options: {
                        responsive: true, // 使图表响应式
                        maintainAspectRatio: false,
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
        } catch (error) {
            console.error(error);
        }
    }, [chartLabels, chartShowData, chartRef]);

    return (
        <div className={styles['horizon-bar-chart-wrapper']}>
            <Tooltip className={styles.name} autoEllipsis title={title} />
            <div className={styles['horizon-chart-content']}>
                <canvas ref={chartRef} />
            </div>
        </div>
    );
};

export default React.memo(View);
