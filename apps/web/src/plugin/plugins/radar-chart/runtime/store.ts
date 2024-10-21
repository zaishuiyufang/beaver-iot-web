import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type OmitFunctions<T> = {
    [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};

export interface ChartStore {
    entityOptions: any[];
    entityData: any[];
    entityMap: Record<string, any>;
    /** 还原store */
    clear: () => void;
}
const initialState: OmitFunctions<ChartStore> = {
    entityOptions: [],
    entityData: [],
    entityMap: {},
};

export default create(
    immer<ChartStore>(set => ({
        ...initialState,
        clear: () => {
            set(initialState);
        },
    })),
);
