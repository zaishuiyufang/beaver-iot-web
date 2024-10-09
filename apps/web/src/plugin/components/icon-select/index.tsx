import Select from '../select';

const iconSelect = (props: any) => {
    const { title, ...rest } = props;

    return <Select {...rest} />;
};

export default iconSelect;
