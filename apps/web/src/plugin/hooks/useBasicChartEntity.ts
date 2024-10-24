import { useEffect, useState } from 'react';
import { useTime } from '@milesight/shared/src/hooks';

export interface UseBasicChartEntityProps {
    entity?: EntityOptionType[];
    time: number;
}

function sleep(duration: number, result: EntityHistoryData): Promise<EntityHistoryData> {
    return new Promise<EntityHistoryData>(resolve => {
        setTimeout(() => {
            resolve(result);
        }, duration);
    });
}

const mockHistory: Record<ApiKey, EntityHistoryData> = {
    5: {
        timestamp: [
            1729771701234, 1729774535678, 1729776890123, 1729773214567, 1729775789012,
            1729772345678, 1729774456789, 1729776789012, 1729773456789, 1729775678901,
        ],
        value: [-15, 7, -3, 19, -8, 12, -20, 6, 0, 14],
    },
    8: {
        timestamp: [
            1729776101234, 1729777202345, 1729778303456, 1729779404567, 1729780505678,
            1729781606789, 1729782707890, 1729783808901,
        ],
        value: [10, -5, 3, -12, 8, -7, 15, -2],
    },
    6: {
        timestamp: [
            1729775101234, 1729776202345, 1729777303456, 1729778404567, 1729779505678,
            1729780606789,
        ],
        value: [4, -10, 13, -6, 9, -1],
    },
};

/** 图表所需展示的数据的类型 */
export interface ChartShowDataProps {
    entityLabel: string;
    entityValues: (string | null)[];
}

export function useBasicChartEntity(props: UseBasicChartEntityProps) {
    const { entity, time } = props;

    const { getTimeFormat } = useTime();

    /**
     * 图表所需展示的数据
     */
    const [chartShowData, setChartShowData] = useState<ChartShowDataProps[]>([]);
    /**
     * 图表 X 轴 label
     */
    const [chartLabels, setChartLabels] = useState<number[]>([]);

    useEffect(() => {
        /**
         * 请求获取实体历史数据
         */
        Promise.all((entity || []).map(e => sleep(500, mockHistory[e.value])))
            .then(result => {
                const newChartLabels = result
                    .reduce((a: number[], c) => {
                        return [...new Set([...a, ...c.timestamp])];
                    }, [])
                    .sort((a, b) => a - b);
                setChartLabels(newChartLabels);

                const newChartShowData: ChartShowDataProps[] = [];

                /**
                 * 实体数据转换
                 */
                (result || []).forEach((r, index) => {
                    const entityLabel = (entity || [])[index].label;

                    /**
                     * 根据时间戳判断当前实体在该时间段是否有数据
                     */
                    const chartData = newChartLabels.map(l => {
                        const valueIndex = r.timestamp.findIndex(t => t === l);
                        if (valueIndex !== -1) {
                            return r.value[valueIndex];
                        }

                        return null;
                    });

                    if (entityLabel) {
                        newChartShowData.push({
                            entityLabel,
                            entityValues: chartData,
                        });
                    }
                });

                setChartShowData(newChartShowData);

                console.log(
                    'needToRequestEntity ? ',
                    newChartShowData,
                    time,
                    newChartLabels,
                    result,
                );
            })
            .catch(e => {
                console.log('Promise.all error ? ', e);
            });
    }, [entity, time]);

    return {
        /**
         * 图表所需展示的数据
         */
        chartLabels: chartLabels.map(l => getTimeFormat(l)),
        /**
         * 图表所需展示的数据
         */
        chartShowData,
    };
}
