import { useNavigate } from 'react-router-dom';
import { Grid2, Backdrop, CircularProgress } from '@mui/material';
import { useRequest } from 'ahooks';
import { DevicesOtherIcon, EntityIcon } from '@milesight/shared/src/components';
import { thousandSeparate, convertKeysToCamelCase } from '@milesight/shared/src/utils/tools';
import {
    integrationAPI,
    IntegrationAPISchema,
    awaitWrap,
    getResponseData,
    isRequestSuccess,
} from '@/services/http';
import { Tooltip } from '@/components';
import './style.less';

const Integration = () => {
    const navigate = useNavigate();
    const handleCardClick = (id: ApiKey) => navigate(`/setting/integration/${id}`);
    const { data: intList, loading } = useRequest(
        async () => {
            // TODO: $ignoreError 为临时处理，待接口正常返回数据后删除
            const [error, resp] = await awaitWrap(
                integrationAPI.getList({}, { $ignoreError: true }),
            );
            if (error || !isRequestSuccess(resp)) return;

            const data = getResponseData(resp);
            const result = data?.integrations.map(item => convertKeysToCamelCase(item));

            console.log(result);
            return result;
        },
        {
            debounceWait: 300,
        },
    );

    return (
        <>
            <Grid2 container spacing={2}>
                <Grid2 size={{ sm: 6, md: 4, xl: 3 }}>
                    <div className="ms-int-card" onClick={() => handleCardClick(1)}>
                        <div className="icon">
                            <img
                                src="https://milesight-msc-us-dev-new.s3.amazonaws.com/tool/57e25ebd-0bd0-4cd3-a5dd-e7f849898d0a-1724138852.jpg"
                                alt="integration icon"
                            />
                        </div>
                        <Tooltip
                            autoEllipsis
                            className="title"
                            title="Milesight Development Platform"
                        />
                        <Tooltip
                            autoEllipsis
                            className="desc"
                            title="This is an integrated description information."
                        />
                        <div className="meta">
                            <span className="meta-item">
                                <DevicesOtherIcon />
                                <span>{thousandSeparate(5316)}</span>
                            </span>
                            <span className="meta-item">
                                <EntityIcon />
                                <span>{thousandSeparate(2)}</span>
                            </span>
                        </div>
                    </div>
                </Grid2>
                {intList?.map(item => (
                    <Grid2 size={{ sm: 6, md: 4, xl: 3 }}>
                        <div className="ms-int-card" onClick={() => handleCardClick(item.id)}>
                            <div className="icon">
                                <img src={item.icon} alt={item.name} />
                            </div>
                            <Tooltip autoEllipsis className="title" title={item.name} />
                            <Tooltip autoEllipsis className="desc" title={item.description} />
                            <div className="meta">
                                <span className="meta-item">
                                    <DevicesOtherIcon />
                                    <span>{thousandSeparate(item.deviceCount)}</span>
                                </span>
                                <span className="meta-item">
                                    <EntityIcon />
                                    <span>{thousandSeparate(item.entityCount)}</span>
                                </span>
                            </div>
                        </div>
                    </Grid2>
                ))}
            </Grid2>
            {loading && <CircularProgress />}
        </>
    );
};

export default Integration;
