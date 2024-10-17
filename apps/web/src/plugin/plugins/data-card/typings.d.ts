export interface ViewConfigProps {
    title: string;
    entity: string;
    [key: string]: string;
}

export type IConfig = any;
export interface IEntity {
    id: string;
    key: string;
    name: string;
    access_mod: 'rw' | 'r' | 'w';
    deviceName?: string;
    integration?: string;
    valueAttribute: Partial<{
        displayType: string;
        unit: string;
        max: number;
        min: number;
        enum: { [key]: string };
        format: string;
        coefficient: number;
    }>;
    valueType: 'string' | 'int' | 'float' | 'boolean' | 'binary' | 'object' | 'enum';
}
