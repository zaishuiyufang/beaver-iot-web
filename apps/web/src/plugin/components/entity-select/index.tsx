import { MenuItem } from '@mui/material';
import Select, { SelectProps } from '../select';
import './style.less';

type EntitySelectProps = SelectProps;
export default (props: EntitySelectProps) => {
    const renderOptions: EntitySelectProps['renderOptions'] = options => {
        return (options || []).map(option => {
            const { label, value, description } = option || {};

            return (
                <MenuItem value={value} key={value}>
                    <div className="ms-entity-select-item">
                        <div className="ms-entity-select-item__label">{label}</div>
                        <div className="ms-entity-select-item__description">{description}</div>
                    </div>
                </MenuItem>
            );
        });
    };
    return <Select {...props} renderOptions={renderOptions} />;
};
