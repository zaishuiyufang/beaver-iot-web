import Select from '../select';
import iconColorSelect from '../icon-color-select';

type Props = {
    /**
     * 下拉选项
     */
    options: OptionsProps[];
};

const iconSelect = (props: any) => {
    const { title, ...rest } = props;

    return <Select {...rest} />;
};

export default iconSelect;
