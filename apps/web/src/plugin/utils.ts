/**
 * 自定义过滤实体选项数据映射对象
 * 若需自定义，通过 filterEntityMap 增加过滤函数往下扩展即可
 */
export const filterEntityMap: Record<
    string,
    ((entityOptions: EntityOptionType[]) => EntityOptionType[]) | undefined
> = {
    /**
     * 如果是枚举要过滤值类型是 string 并且有 enum 字段的
     */
    filterEntityStringHasEnum: (entityOptions: EntityOptionType[]): EntityOptionType[] => {
        // 如果是枚举要过滤值类型是string并且有enum字段的
        return entityOptions.filter((e: EntityOptionType) => {
            return e.valueType !== 'STRING' || e.rawData?.entityValueAttribute?.enum;
        });
    },
};
