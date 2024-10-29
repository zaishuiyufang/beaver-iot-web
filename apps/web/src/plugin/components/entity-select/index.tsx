import { MenuItem, Autocomplete, TextField } from '@mui/material';

import type { AutocompleteProps } from '@mui/material';

import { useI18n } from '@milesight/shared/src/hooks';
import { useEntitySelectOptions } from '../../hooks';

import './style.less';

type EntitySelectProps = AutocompleteProps<EntityOptionType, undefined, false, undefined> &
    EntitySelectCommonProps<EntityOptionType>;

/**
 * 实体选择下拉框组件（单选）
 */
const EntitySelect = (props: EntitySelectProps) => {
    const { onChange, entityType, entityValueTypes, accessMods, ...restProps } = props;

    const { getIntlText } = useI18n();

    /**
     * 动态从服务器获取 options
     */
    const {
        loading,
        getEntityOptions,
        options = [],
    } = useEntitySelectOptions({
        entityType,
        entityValueTypes,
        accessMods,
    });

    const renderOption: EntitySelectProps['renderOption'] = (optionProps, option) => {
        const { label, value, description } = option || {};

        return (
            <MenuItem {...(optionProps || {})} key={value}>
                <div className="ms-entity-select-item">
                    <div className="ms-entity-select-item__label">{label}</div>
                    <div className="ms-entity-select-item__description">{description}</div>
                </div>
            </MenuItem>
        );
    };

    return (
        <Autocomplete
            {...restProps}
            onChange={(_, option) => onChange(option)}
            options={options}
            renderInput={params => (
                <TextField {...params} label={getIntlText('common.label.entity')} />
            )}
            renderOption={renderOption}
            getOptionLabel={option => option?.label || ''}
            loading={loading}
            filterOptions={options => options}
            onInputChange={(_, keyword, reason) => {
                if (reason !== 'input') return;

                getEntityOptions(keyword);
            }}
            isOptionEqualToValue={(option, currentVal) => option.value === currentVal.value}
        />
    );
};

export default EntitySelect;
