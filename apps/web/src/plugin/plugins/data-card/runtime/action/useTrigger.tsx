import useDataViewStore from '../store';
import type { ViewConfigProps } from '../../typings';

interface IProps {
    onChange: (data: ViewConfigProps) => void;
}
export const useTrigger = ({ onChange }: IProps) => {
    const handleChange = (value: ViewConfigProps) => {
        const { entity } = value || {};

        // 获取当前选中实体
        const { entityMap } = useDataViewStore.getState();
        const currentEntity = entityMap?.[entity];

        value.title = currentEntity?.entityName;
        onChange(value);
    };

    return {
        handleChange,
    };
};
