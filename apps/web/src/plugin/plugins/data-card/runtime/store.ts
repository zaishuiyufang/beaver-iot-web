import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type OmitFunctions<T> = {
    [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};

export interface DataViewStore {
    entityOptions: any[];
    entityData: any[];
    entityMap: Record<string, any>;
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
