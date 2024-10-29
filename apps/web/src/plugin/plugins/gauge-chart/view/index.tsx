import { useEffect, useRef } from 'react';
import { isNil } from 'lodash-es';
import { useRequest } from 'ahooks';
import { useI18n, useTheme } from '@milesight/shared/src/hooks';
import { awaitWrap, entityAPI, getResponseData, isRequestSuccess } from '@/services/http';
import Chart from './gauge';
import type { ViewConfigProps } from '../typings';
import './style.less';

interface Props {
    config: ViewConfigProps;
}
const View = (props: Props) => {
    const { config } = props;
    const { entity, title, time, metrics } = config || {};
    const { getIntlText } = useI18n();
    const chartRef = useRef<HTMLCanvasElement>(null);
    const { blue, grey } = useTheme();

    const { data: aggregateHistoryData } = useRequest(
        async () => {
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

            return getResponseData(resp);
        },
        { refreshDeps: [entity, time, metrics] },
    );

    /** 渲染仪表图 */
    const renderGaugeChart = (datasets: {
        minValue?: number;
        maxValue?: number;
        currentValue: number;
    }) => {
        const ctx = chartRef.current!;
        if (!ctx) return;

        // 换成成符合条件的数据
        const { minValue: min, maxValue: max, currentValue: value } = datasets || {};
        const currentValue = value || 0;
        const minValue = min || 0;
        const maxValue = max ? Math.max(max, currentValue) : currentValue;
        const data = [...new Set([currentValue, maxValue])].filter(v => !isNil(v)) as number[];

        // 渲染图表
        const circumference = 216; // 定义仪表盘的周长
        const rotation = (360 - 216) / 2 + 180;
        const chart = new Chart(ctx, {
            type: 'gauge',
            data: {
                datasets: [
                    {
                        data,
                        minValue,
                        value: currentValue,
                        backgroundColor: [blue[700], grey[100]],
                    },
                ],
            },
            options: {
                cutout: '90%', // 通过设置 cutout 属性调整圆环宽度，值越大圆环越细
                needle: {
                    radiusPercentage: 1.5,
                    widthPercentage: 3,
                    lengthPercentage: 80,
                    color: blue[600],
                },
                circumference,
                rotation,
                valueLabel: {
                    fontSize: 20,
                    display: true,
                    formatter: null,
                    color: grey[700],
                    bottomMarginPercentage: -20,
                },
            },
        });
        return () => chart?.destroy();
    };

    const headerLabel = title || getIntlText('common.label.title');
    useEffect(() => {
        if (!aggregateHistoryData) return;
        const { value } = aggregateHistoryData || {};

        const { rawData } = entity || {};
        const { entityValueAttribute } = rawData || {};
        const { min, max } = entityValueAttribute || {};

        const currentValue = value || 0;
        const minValue = min || 0;
        const maxValue = max || 0;
        return renderGaugeChart({ minValue, maxValue, currentValue });
    }, [aggregateHistoryData]);

    return (
        <div className="ms-gauge-chart">
            <div className="ms-gauge-chart__header">{headerLabel}</div>
            <canvas id="gaugeChart" ref={chartRef} />
        </div>
    );
};

export default View;
