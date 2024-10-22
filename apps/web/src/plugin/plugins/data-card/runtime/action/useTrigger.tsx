import { useRef } from 'react';
import useDataViewStore from '../store';
import type { ViewConfigProps } from '../../typings';

interface IProps {
    onChange: (data: ViewConfigProps) => void;
}
export const useTrigger = ({ onChange }: IProps) => {
    const prevStateRef = useRef<ViewConfigProps>();

    const handleChange = (value: ViewConfigProps) => {
        const { entity } = value || {};
        const entityValue = entity?.value;

        // 如果实体变化时，更新title为当前选中实体名称
        if (prevStateRef.current?.entity?.value !== entityValue) {
            // 当前选中实体
            const { entityMap } = useDataViewStore.getState();
            const currentEntity = entityMap?.[entityValue];

            value.title = currentEntity?.entityName;
        }

        prevStateRef.current = value;
        onChange(value);
    };

    return {
        handleChange,
    };
};
