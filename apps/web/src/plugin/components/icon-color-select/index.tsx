import Select from '../select';
import { OptionsProps } from '../../render/typings';

type Props = {
    /**
     * 下拉选项
     */
    options: OptionsProps[];
};

const iconColorSelect = (props: any) => {
    const { ...rest } = props;

    return (
        <div>
            <Select {...rest} />
        </div>
    );
};

export default iconColorSelect;
