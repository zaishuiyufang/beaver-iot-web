import { useMemo, Fragment } from 'react';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';
import './style.less';

interface Props {
    /**
     * 描述列表数据
     */
    data?: {
        key: ApiKey;
        label: React.ReactNode;
        content: React.ReactNode;
    }[];

    /**
     * 每行渲染数据对数量，默认为 2
     *
     * __注意__：当前样式仅支持 2 列，若要修改，请自行调整样式
     */
    columns?: number;
}

/**
 * 描述列表组件
 */
const Descriptions: React.FC<Props> = ({ data, columns = 2 }) => {
    const list = useMemo(() => {
        return data?.reduce(
            (acc, item) => {
                const lastIndex = acc.length - 1 < 0 ? 0 : acc.length - 1;
                const index = acc[lastIndex]?.length >= columns ? lastIndex + 1 : lastIndex;

                if (!acc[index]) acc[index] = [];
                acc[index].push(item);

                return acc;
            },
            [] as NonNullable<Props['data']>[],
        );
    }, [data, columns]);

    return (
        <Table className="ms-descriptions">
            <TableBody>
                {list?.map((items, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <TableRow key={index}>
                        {items.map(item => (
                            <Fragment key={item.key}>
                                <TableCell className="ms-descriptions-label">
                                    {item.label}
                                </TableCell>
                                <TableCell className="ms-descriptions-content">
                                    {item.content}
                                </TableCell>
                            </Fragment>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default Descriptions;
