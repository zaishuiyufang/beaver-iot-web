import { useEffect } from 'react';
import { useAction } from './action';
import { useReducer } from './reducer';
import useDataViewStore from './store';
import type { ConfigureType, ViewConfigProps } from '../typings';

interface IProps {
    value: ViewConfigProps;
    config: ConfigureType;
    onChange: (data: ViewConfigProps) => void;
}
export const useConnect = ({ value, config, onChange }: IProps) => {
    const { handleChange } = useAction({ value, config, onChange });
    const { configure } = useReducer({ value, config });

    useEffect(() => {
        return () => {
            const { clear } = useDataViewStore.getState();
            clear && clear();
        };
    }, []);
    return {
        configure,
        handleChange,
    };
};
