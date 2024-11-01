import { useEffect, useRef } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto'; // 引入 Chart.js
import { useI18n, useTheme } from '@milesight/shared/src/hooks';
import { useSource } from './hooks';
import type { AggregateHistoryList, ViewConfigProps } from '../typings';
import './style.less';

interface IProps {
    config: ViewConfigProps;
}
const View = (props: IProps) => {
    const { config } = props;
    const { entityList, title, metrics, time } = config || {};
    const { getIntlText } = useI18n();
    const { blue, white } = useTheme();
    const { aggregateHistoryList } = useSource({ entityList, metrics, time });
    const headerLabel = title || getIntlText('common.label.title');

    const chartRef = useRef<HTMLCanvasElement>(null);

    /** 渲染雷达图 */
    const renderRadarChart = (
        data: ChartConfiguration['data'],
        aggregateHistoryList: AggregateHistoryList[],
    ) => {
        const ctx = chartRef.current!;
        if (!ctx) return;

        const chart = new Chart(ctx, {
            type: 'radar',
            data,
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        filter: tooltipItem => {
                            return tooltipItem.dataIndex <= aggregateHistoryList.length - 1; // 只显示真实的点
                        },
                        callbacks: {
                            label: context => {
                                const { raw, dataset, dataIndex } = context || {};

                                const label = dataset.label || '';

                                // 获取单位
                                const getUnit = () => {
                                    const { entity } = aggregateHistoryList[dataIndex] || {};
                                    const { rawData: currentEntity } = entity || {};
                                    if (!currentEntity) return;

                                    // 获取当前选中实体
                                    const { entityValueAttribute } = currentEntity || {};
                                    const { unit } = entityValueAttribute || {};
                                    return unit;
                                };
                                const unit = getUnit();

                                // 自定义悬停时显示的文字内容
                                return `${label}${raw}${unit || ''}`;
                            },
                        },
                    },
                },
                elements: {
                    line: {
                        borderWidth: 3,
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
    };
    useEffect(() => {
        const historyList = aggregateHistoryList || [];

        // 填充占位图表数据
        const getFillList = <T,>(list: T[] = []): T[] => {
            const DEFAULT_COUNT = 5;
            if (list && list.length >= DEFAULT_COUNT) return list;

            // 余量
            const surplus = 5 - list.length;
            const surplusList = new Array(surplus).fill({
                entity: {
                    label: '',
                },
                data: {
                    value: 0,
                },
            });

            return [...list, ...surplusList];
        };
        const lists = getFillList(historyList);

        const data = {
            labels: (lists || []).map(item => item?.entity?.label),
            datasets: [
                {
                    data: historyList.map(item => item?.data?.value || 0),
                    fill: true,
                    backgroundColor: blue[300],
                    borderColor: blue[600],
                    pointBackgroundColor: blue[700],
                    pointBorderColor: white,
                    pointHoverBackgroundColor: white,
                    pointHoverBorderColor: blue[700],
                },
            ],
        };
        return renderRadarChart(data, historyList);
    }, [aggregateHistoryList]);

    return (
        <div className="ms-radar-chart">
            <div className="ms-radar-chart__header">{headerLabel}</div>
            <div className="ms-radar-chart__content">
                <canvas id="radarChart" ref={chartRef} />
            </div>
        </div>
    );
};

export default View;
