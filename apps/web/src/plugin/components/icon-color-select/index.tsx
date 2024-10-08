import Select from '../select';

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
