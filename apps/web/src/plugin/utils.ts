/**
 * 自定义过滤实体选项数据
 */
export const filterEntityStringHasEnum = (
    entityOptions: EntityOptionType[],
): EntityOptionType[] => {
    // 如果是枚举要过滤值类型是string并且有enum字段的
    return entityOptions.filter((e: EntityOptionType) => {
        return e.valueType !== 'STRING' || e.rawData?.entityValueAttribute?.enum;
    });
};
