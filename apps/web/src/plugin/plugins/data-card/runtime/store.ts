import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { IEntity } from '../typings';

export type OmitFunctions<T> = {
    [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};
export interface DataViewStore {
    entityData: IEntity[];
    entityMap: Record<string, IEntity>;
    entityOptions: {
        label: string;
        value: string;
        description?: string;
    }[];
    /** 还原store */
    clear: () => void;
}
const initialState: OmitFunctions<DataViewStore> = {
    entityOptions: [],
    entityData: [],
    entityMap: {},
};

export default create(
    immer<DataViewStore>(set => ({
        ...initialState,
        clear: () => {
            set(initialState);
        },
    })),
);
