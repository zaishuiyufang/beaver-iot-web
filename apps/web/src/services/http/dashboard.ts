import { client, attachAPI, API_PREFIX } from './client';

/**
 * 设备详情定义
 */
export interface DashboardDetail {
    dashboard_id: ApiKey;
    name: string;
    widgets: WidgetDetail[];
}

export interface WidgetDetail {
    widget_id?: ApiKey;
    data: Record<string, any>;
}

/**
 * 设备相关接口定义
 */
export interface DashboardAPISchema extends APISchema {
    /** 获取列表 */
    getDashboards: {
        request: void;
        response: DashboardDetail[];
    };

    /** 添加dashboard */
    addDashboard: {
        request: {
            /** 名称 */
            name: string;
        };
        response: unknown;
    };

    /** 删dashboard */
    deleteDashboard: {
        request: {
            id: ApiKey;
        };
        response: unknown;
    };

    /** 更新dashboard */
    updateDashboard: {
        request: {
            id: ApiKey;
            /** 名称 */
            name?: string;
            widgets?: WidgetDetail;
        };
        response: unknown;
    };

    /** 添加组件 */
    addWidget: {
        request: Record<string, any>;
        response: unknown;
    };

    /** 删除组件 */
    deleteWidget: {
        request: {
            dashboard_id: ApiKey;
            widget_id: ApiKey;
        };
        response: unknown;
    };

    /** 更新组件 */
    updateWidget: {
        request: Record<string, any>;
        response: unknown;
    };
}

/**
 * 设备相关 API 服务
 */
export default attachAPI<DashboardAPISchema>(client, {
    apis: {
        getDashboards: `POST ${API_PREFIX}/dashboards`,
        addDashboard: `POST ${API_PREFIX}/dashboard`,
        deleteDashboard: `DELETE ${API_PREFIX}/dashboard/:id`,
        updateDashboard: `PUT ${API_PREFIX}/device/:id`,
        addWidget: `POST ${API_PREFIX}/dashboard/:id/widget`,
        updateWidget: `PUT ${API_PREFIX}/dashboard/:id/widget/:widget_id`,
        deleteWidget: `DELETE ${API_PREFIX}/dashboard/:id/widget/:widget_id`,
    },
});
