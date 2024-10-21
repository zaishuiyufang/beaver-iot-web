import { useAction } from './action';
import { useReducer } from './reducer';
import type { ConfigureType, ViewConfigProps } from '../typings';

interface IProps {
    value: ViewConfigProps;
    config: ConfigureType;
}
export const useConnect = ({ value, config }: IProps) => {
    useAction({ value, config });
    const { configure } = useReducer({ value, config });

    return {
        configure,
    };
};
