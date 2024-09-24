import Select from '../select';
import { OptionsProps } from '../../render/typings';

type Props = {
    /**
     * 下拉选项
     */
    options: OptionsProps[];
}

const iconSelect = (props: any) => {
    const { title, ...rest } = props;

    return (
        <div>
            <Select {...rest} />
        </div>
    )
}

export default iconSelect;