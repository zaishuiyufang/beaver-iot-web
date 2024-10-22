import { useMemo } from 'react';
import { cloneDeep } from 'lodash-es';
import useDataViewStore from '../store';
import { useDynamic } from './useDynamic';
import { useEntityOpts } from './useEntityOpts';
import type { ConfigureType, ViewConfigProps } from '../../typings';

interface IProps {
    value: ViewConfigProps;
    config: ConfigureType;
}
export const useReducer = ({ value, config }: IProps) => {
    const store = useDataViewStore();
    const { updateDynamicForm } = useDynamic();
    const { updateEntityOptions } = useEntityOpts();

    /** config实时保存value */
    const updateConfigState = (value: ViewConfigProps, config: ConfigureType) => {
        config.config = value || {};

        return config;
    };

    /** 生成新的configure */
    const configure = useMemo(() => {
        const ChainCallList = [updateConfigState, updateEntityOptions, updateDynamicForm];

        const newConfig = ChainCallList.reduce((config, fn) => {
            return fn(value, cloneDeep(config), store);
        }, config);

        return { ...newConfig };
    }, [value, config, store]);

    return {
        configure,
    };
};
