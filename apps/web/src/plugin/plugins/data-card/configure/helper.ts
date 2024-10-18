import type { IEntity } from '../typings';

/* 将实体数据转换为下拉选项 */
export const entityToOptions = (entityData: IEntity[]) => {
    return (entityData || []).map(entity => {
        // 实体名称、设备、来源集成
        const { id, name, deviceName, integration } = entity || {};

        return {
            label: name,
            value: id,
            description: [deviceName, integration].join(','),
        };
    });
};
