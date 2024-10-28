import { useEffect, useRef } from 'react';
import { useRequest } from 'ahooks';
import { useI18n, useTheme } from '@milesight/shared/src/hooks';
import { awaitWrap, entityAPI, getResponseData, isRequestSuccess } from '@/services/http';
import Chart from './gauge';
import type { ViewConfigProps } from '../typings';
import './style.less';

interface Props {
    config: ViewConfigProps;
}
const extendArray = <T,>(arr: T[], n: number): T[] => {
    return Array.from({ length: n }, (_, i) => arr[i % arr.length]);
};
const View = (props: Props) => {
    const { config } = props;
    const { entity, title, time, metrics } = config || {};
    const { getIntlText } = useI18n();
    const chartRef = useRef<HTMLCanvasElement>(null);
    const { blue, green, red, yellow, grey } = useTheme();
    const colors = [blue[700], green[700], red[700], yellow[700]];

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
        { refreshDeps: [entity, title, time, metrics] },
    );

    /** 渲染仪表图 */
    const renderGaugeChart = (datasets: {
        data: number[];
        minValue?: number;
        currentValue: number;
    }) => {
        const ctx = chartRef.current!;
        if (!ctx) return;
        const { data, minValue, currentValue } = datasets || {};

        const bgColors = extendArray(colors, data.length);
        const chart = new Chart(ctx, {
            type: 'gauge',
            data: {
                datasets: [
                    {
                        data,
                        minValue,
                        value: currentValue,
                        backgroundColor: bgColors,
                    },
                ],
            },
            options: {
                needle: {
                    radiusPercentage: 3,
                    widthPercentage: 3.6,
                    lengthPercentage: 80,
                    color: grey[700],
                },
                //     valueLabel: {
                //         display: true,
                //         formatter: (value: number) => `$${Math.round(value)}`,
                //         color: 'rgba(255, 255, 255, 1)',
                //         backgroundColor: 'rgba(0, 0, 0, 1)',
                //         borderRadius: 5,
                //         padding: {
                //             top: 10,
                //             bottom: 10,
                //         },
                //     },
            },
        });
        return () => chart?.destroy();
    };

    const headerLabel = title || getIntlText('common.label.title');
    useEffect(() => {
        const { value } = aggregateHistoryData || {};

        const { rawData } = entity || {};
        const { entityValueAttribute } = rawData || {};
        const { min, max } = entityValueAttribute || {};

        const data = [max || value || 0];
        const minValue = min || 0;
        const currentValue = value || 0;

        return renderGaugeChart({ data, minValue, currentValue });
    }, [entity, aggregateHistoryData]);

    return (
        <div className="ms-gauge-chart">
            <div className="ms-gauge-chart__header">{headerLabel}</div>
            <canvas id="gaugeChart" ref={chartRef} />
        </div>
    );
};

export default View;
