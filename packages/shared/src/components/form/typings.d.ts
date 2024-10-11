declare type rulesPatternType = {
    value: any;
    message: string;
};

declare type rulesType = {
    required?: boolean | string;
    pattern?: rulesPatternType;
    minLength?: rulesPatternType;
    maxLength?: rulesPatternType;
    min?: rulesPatternType;
    max?: rulesPatternType;
};

declare type fieldType = {
    onChange: any;
    value: fieldStateProps;
};

declare type fieldStateType = {
    error: any;
};

declare interface renderType {
    field: fieldType;
    fieldState: fieldStateType;
    formState: any;
}

declare interface FormItemsProps {
    name: Path<T>;
    render: any;
    multiple?: number;
    multipleIndex?: number;
    rules?: rulesType;
    style?: string;
    title?: string;
}

declare type UseFormItemsType = Omit<FormItemsProps, 'render'>;

declare interface UseFormItemsProps extends UseFormItemsType {
    label: string;
    type: string;
    props?: any;
    render?: (data: renderType) => void;
}
