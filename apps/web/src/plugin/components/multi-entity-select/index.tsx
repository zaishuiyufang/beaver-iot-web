import { Autocomplete, TextField, Checkbox } from '@mui/material';

import type { AutocompleteProps } from '@mui/material';

import { useEntitySelectOptions } from '../../hooks';

import './style.less';

type EntitySelectProps = AutocompleteProps<EntityOptionType, true, false, undefined> &
    EntitySelectCommonProps<EntityOptionType[]>;

/**
 * 实体选择下拉框组件（多选）
 */
const MultiEntitySelect = (props: EntitySelectProps) => {
    const { value, onChange, entityType, entityValueTypes, accessMods, ...restProps } = props;

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

    const renderOption: EntitySelectProps['renderOption'] = (optionProps, option, { selected }) => {
        const { label, value, description } = option || {};

        return (
            <li {...(optionProps || {})} key={value}>
                <div className="ms-multi-entity-select">
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
                    <div className="ms-entity-select-item">
                        <div className="ms-entity-select-item__label">{label}</div>
                        <div className="ms-entity-select-item__description">{description}</div>
                    </div>
                </div>
            </li>
        );
    };

    return (
        <Autocomplete
            {...restProps}
            multiple
            onChange={(_, option) => onChange(option)}
            options={options}
            getOptionDisabled={option => {
                const currentValue = value || [];
                /**
                 * 实体最多只能选择 5 个
                 */
                if (currentValue.length < 5) {
                    return false;
                }

                return currentValue.every(e => e.value !== option.value);
            }}
            renderInput={params => <TextField {...params} label="Entity" placeholder="Favorites" />}
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

export default MultiEntitySelect;
