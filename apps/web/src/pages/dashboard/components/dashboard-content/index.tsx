import { useState, useRef } from 'react';
import { Button, Popover } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useI18n } from '@milesight/shared/src/hooks';
import AddWidget from '../add-widget';
import PluginList from '../plugin-list';
import PluginListClass from '../plugin-list-class';
import AddCustomerWidget from '../custom-widget';
import Widgets from '../widgets';

export default () => {
    const { getIntlText } = useI18n();
    const [isShowAddWidget, setIsShowAddWidget] = useState(false);
    const [widgets, setWidgets] = useState<any[]>([]);
    const [plugin, setPlugin] = useState<CustomComponentProps>();
    const [showCustom, setShowCustom] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    const handleShowAddWidget = (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsShowAddWidget(true);
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAddWidgetPopover = () => {
        setIsShowAddWidget(false);
        setAnchorEl(null);
    };

    const handleSelectPlugin = (type: CustomComponentProps) => {
        setPlugin(type);
    };

    const closeAddWidget = () => {
        setPlugin(undefined);
    };

    const handleOk = (data: any) => {
        // TODO: add widget
        console.log(data);
        setWidgets([...widgets, data]);
    };

    const handleShowAddCustomWidget = () => {
        setShowCustom(true);
    };

    const closeAddCustomWidget = () => {
        setShowCustom(false);
    };

    return (
        <div className="dashboard-content">
            <div className="dashboard-content-operate">
                <Button variant="contained" onClick={handleShowAddWidget}>
                    {getIntlText('dashboard.add_widget')}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleShowAddCustomWidget}
                    sx={{ marginLeft: '20px' }}
                >
                    添加自定义组件
                </Button>
            </div>
            {!!plugin && <AddWidget plugin={plugin} onCancel={closeAddWidget} onOk={handleOk} />}
            {!widgets?.length ? (
                <div className="dashboard-content-empty">
                    <div className="dashboard-content-empty-title">
                        {getIntlText('dashboard.empty_text')}
                    </div>
                    <div className="dashboard-content-empty-description">
                        {getIntlText('dashboard.empty_description')}
                    </div>
                    <PluginList onSelect={handleSelectPlugin} />
                </div>
            ) : (
                <div className="dashboard-content-main" ref={mainRef}>
                    <DndProvider backend={HTML5Backend}>
                        <Widgets
                            parentRef={mainRef}
                            widgets={widgets}
                            onChangeWidgets={setWidgets}
                        />
                    </DndProvider>
                </div>
            )}
            {!!showCustom && <AddCustomerWidget onCancel={closeAddCustomWidget} />}
            <Popover
                open={isShowAddWidget}
                anchorEl={anchorEl}
                onClose={handleCloseAddWidgetPopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <PluginListClass onSelect={handleSelectPlugin} />
            </Popover>
        </div>
    );
};
