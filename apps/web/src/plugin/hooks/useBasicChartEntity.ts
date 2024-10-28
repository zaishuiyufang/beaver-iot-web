import { useEffect, useState, useCallback } from 'react';

import { useTime } from '@milesight/shared/src/hooks';
import { entityAPI, isRequestSuccess, getResponseData } from '@/services/http';

export interface UseBasicChartEntityProps {
    entity?: EntityOptionType[];
    time: number;
}

/** 图表所需展示的数据的类型 */
export interface ChartShowDataProps {
    entityLabel: string;
    entityValues: (string | number | null)[];
}

/**
 * 边框颜色定义
 */
const BORDER_COLORS = [
    'rgba(255, 99, 132, 1)', // 柔和的红色
    'rgba(54, 162, 235, 1)', // 柔和的蓝色
    'rgba(255, 206, 86, 1)', // 柔和的黄色
    'rgba(75, 192, 192, 1)', // 柔和的青色
    'rgba(153, 102, 255, 1)', // 柔和的紫色
];

/**
 * 背景颜色定义
 */
const BACKGROUND_COLORS = [
    'rgba(255, 99, 132, 0.3)', // 柔和的透明红色
    'rgba(54, 162, 235, 0.3)', // 柔和的透明蓝色
    'rgba(255, 206, 86, 0.3)', // 柔和的透明黄色
    'rgba(75, 192, 192, 0.3)', // 柔和的透明青色
    'rgba(153, 102, 255, 0.3)', // 柔和的透明紫色
];

/**
 * 基础图表数据统一处理逻辑 hooks
 * 目前使用于（柱状图、横向柱状图、折线图、面积图）
 */
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
         * 初始化数据
         */
        setChartShowData([]);
        setChartLabels([]);

        if (!Array.isArray(entity)) return;

        /**
         * 请求获取实体历史数据
         */
        Promise.all(
            (entity || []).map(e =>
                entityAPI.getHistory({
                    entity_id: e.value,
                    start_timestamp: Date.now() - time,
                    end_timestamp: Date.now(), // 当前时间
                    page_number: 1,
                    page_size: 999,
                }),
            ),
        ).then(result => {
            /**
             * 判断是否有请求失败的数据
             */
            const isFailed = (result || []).some(res => !isRequestSuccess(res));
            if (isFailed) return;

            const historyData = (result || [])
                .map(res => getResponseData(res))
                .filter(Boolean)
                .map(d => d?.content || []);

            /**
             * 去重处理，获取所有值的时间段
             */
            const newChartLabels = historyData
                .reduce((a: number[], c) => {
                    const times = (c || [])?.map(h => h.timestamp)?.filter(Boolean) || [];

                    return [...new Set([...a, ...times])];
                }, [])
                .sort((a, b) => a - b);
            setChartLabels(newChartLabels);

            const newChartShowData: ChartShowDataProps[] = [];

            /**
             * 实体数据转换
             */
            (historyData || []).forEach((h, index) => {
                const entityLabel = (entity || [])[index]?.label || '';

                /**
                 * 根据时间戳判断当前实体在该时间段是否有数据
                 */
                const chartData = newChartLabels.map(l => {
                    const valueIndex = h.findIndex(item => item.timestamp === l);
                    if (valueIndex !== -1) {
                        return h[valueIndex].value;
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
        });
    }, [entity, time]);

    /**
     * 获取边框颜色
     */
    const getBorderColor = useCallback((index: number) => {
        return BORDER_COLORS[index % BORDER_COLORS.length];
    }, []);

    /**
     * 获取背景颜色
     */
    const getBackgroundColor = useCallback((index: number) => {
        return BACKGROUND_COLORS[index % BACKGROUND_COLORS.length];
    }, []);

    return {
        /**
         * 图表所需展示的数据
         */
        chartLabels: chartLabels.map(l => getTimeFormat(Number(l))),
        /**
         * 图表所需展示的数据
         */
        chartShowData,
        /**
         * 获取边框颜色
         */
        getBorderColor,
        /**
         * 获取背景颜色
         */
        getBackgroundColor,
    };
}
