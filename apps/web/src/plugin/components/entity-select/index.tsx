import { useMemo } from 'react';
import { MenuItem, Autocomplete, TextField } from '@mui/material';

import type { AutocompleteProps } from '@mui/material';
import './style.less';

/**
 * 实体下拉框类型
 */
export interface EntityOptionType {
    label: string;
    value: string;
    description: string;
}

type EntitySelectProps = AutocompleteProps<EntityOptionType, undefined, undefined, undefined> & {
    onChange: (value: EntityOptionType | null) => void;
};

/**
 * 实体选择下拉框组件
 */
const EntitySelect = (props: EntitySelectProps) => {
    const entityOptions = useMemo(() => {
        return [
            {
                label: 'Option 1',
                value: 'option value 1',
                description: 'Option 1 Description',
            },
            {
                label: 'Option 2',
                value: 'option value 2',
                description: 'Option 2 Description',
            },
            {
                label: 'Option 3',
                value: 'option value 3',
                description: 'Option 3 Description',
            },
        ];
    }, []);

    const { onChange, options = entityOptions } = props;

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
            {...props}
            onChange={(_, option) => onChange(option)}
            options={options}
            renderInput={params => <TextField {...params} label="Entity" placeholder="Favorites" />}
            renderOption={renderOption}
            getOptionLabel={option => option?.label || ''}
        />
    );
};

export default EntitySelect;
