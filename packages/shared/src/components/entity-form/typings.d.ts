declare interface EntityFormProps {
    entities: EntityType[];
    onOk: (data: any) => void;
}

// 实体类定义
declare type EntityType = {
    /**
     * 实体id
     */
    id: string;
    /**
     * 实体key
     */
    key: string;
    /**
     * 实体名称
     */
    name: string;
    /**
     * 实体类型
     */
    type: string;
    /**
     * 实体属性
     */
    access_mod: 'r' | 'w' | 'rw' | null;
    /**
     * 实体父级id
     */
    parent_id?: string | null;
    /**
     * 实体值属性
     */
    value_attribute?: any;
};
