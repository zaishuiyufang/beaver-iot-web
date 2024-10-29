import { useEffect, useRef } from 'react';
import { useRequest } from 'ahooks';
import Chart, { ChartConfiguration } from 'chart.js/auto'; // 引入 Chart.js
import { useI18n, useTheme } from '@milesight/shared/src/hooks';
import {
    awaitWrap,
    entityAPI,
    EntityAPISchema,
    getResponseData,
    isRequestSuccess,
} from '@/services/http';
import { ViewConfigProps } from '../typings';
import './style.less';

interface IProps {
    config: ViewConfigProps;
}
interface AggregateHistoryList {
    entity: EntityOptionType;
    data: EntityAPISchema['getAggregateHistory']['response'];
}
const View = (props: IProps) => {
    const { config } = props;
    const { entityList, title, metrics, time } = config || {};
    const { getIntlText } = useI18n();
    const { blue, white } = useTheme();
    const headerLabel = title || getIntlText('common.label.title');

    const chartRef = useRef<HTMLCanvasElement>(null);
    const { data: aggregateHistoryList } = useRequest(
        async () => {
            if (!entityList || entityList.length === 0) return;

            const run = async (entity: EntityOptionType) => {
                const { value: entityId } = entity || {};
                if (!entityId) return;

                const now = Date.now();
                const [error, resp] = await awaitWrap(
                    entityAPI.getAggregateHistory({
                        entity_id: entityId,
                        aggregate_type: metrics,
                        start_timestamp: now - time,
                        end_timestamp: now,
                    }),
                );
                if (error || !isRequestSuccess(resp)) return;

                const data = getResponseData(resp);
                return {
                    entity,
                    data,
                } as AggregateHistoryList;
            };
            const fetchList = entityList.map(entity => run(entity));
            return Promise.all(fetchList.filter(Boolean) as unknown as AggregateHistoryList[]);
        },
        { refreshDeps: [entityList, time, metrics] },
    );

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
            <canvas id="radarChart" ref={chartRef} />
        </div>
    );
};

export default View;
