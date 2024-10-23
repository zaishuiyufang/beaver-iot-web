import { MenuItem, Autocomplete, TextField } from '@mui/material';

import type { AutocompleteProps } from '@mui/material';

import { useEntitySelectOptions } from '../../hooks';

import './style.less';

type EntitySelectProps = AutocompleteProps<EntityOptionType, undefined, false, undefined> &
    EntitySelectCommonProps<EntityOptionType>;

/**
 * 实体选择下拉框组件（单选）
 */
const EntitySelect = (props: EntitySelectProps) => {
    const { onChange, entityType, entityValueTypes, ...restProps } = props;

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
    });

    const renderOption: EntitySelectProps['renderOption'] = (optionProps, option) => {
        const { key, ...restOptionProps } = optionProps || {};
        const { label, description } = option || {};

        return (
            <MenuItem key={key} {...restOptionProps}>
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
            renderInput={params => <TextField {...params} label="Entity" placeholder="Favorites" />}
            renderOption={renderOption}
            getOptionLabel={option => option?.label || ''}
            loading={loading}
            filterOptions={options => options}
            onInputChange={(_, keyword, reason) => {
                if (reason !== 'input') return;

                getEntityOptions(keyword);
            }}
        />
    );
};

export default EntitySelect;
