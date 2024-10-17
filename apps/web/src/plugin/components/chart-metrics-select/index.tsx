import { useMemo } from 'react';
import { useI18n } from '@milesight/shared/src/hooks';

import Select, { type SelectProps } from '../select';

/**
 *  图表展示时间选择组件
 */
const ChartTimeSelect = (selectProps: SelectProps) => {
    const { getIntlText } = useI18n();

    const defaultOptions: OptionsProps[] = useMemo(() => {
        return [
            {
                label: getIntlText('dashboard.label_latest_value'),
                value: 'latest',
            },
            {
                label: getIntlText('dashboard.label_min_value'),
                value: 'min',
            },
            {
                label: getIntlText('dashboard.label_max_value'),
                value: 'max',
            },
            {
                label: getIntlText('dashboard.label_avg_value'),
                value: 'avg',
            },
            {
                label: getIntlText('dashboard.label_sum_value'),
                value: 'sum',
            },
            {
                label: getIntlText('dashboard.label_count_value'),
                value: 'count',
            },
        ];
    }, [getIntlText]);

    const { options = defaultOptions, ...restOptions } = selectProps || {};

    return <Select options={options} {...restOptions} />;
};

export default ChartTimeSelect;
