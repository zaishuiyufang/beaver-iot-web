import { useState } from 'react';
import { Button } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import AddWidget from '../add-widget';
import PluginList from '../plugin-list';

export default () => {
    const { getIntlText } = useI18n();
    const [isShowAddWidget, setIsShowAddWidget] = useState(false);
    const [swigets, setSwigets] = useState<any[]>([]);
    const [plugin, setPlugin] = useState<CustomComponentProps>();

    const handleShowAddWidget = () => {
        setIsShowAddWidget(true);
    };

    const handleSelectPlugin = (type: CustomComponentProps) => {
        setPlugin(type);
    }

    return (
        <div className="dashboard-content">
            <Button variant="contained" onClick={handleShowAddWidget}>
                {getIntlText('dashboard.add_widget')}
            </Button>
            {
                !!plugin && <AddWidget plugin={plugin} />
            }
            {
                !swigets?.length && (
                    <PluginList onSelect={handleSelectPlugin} />
                )
            }
        </div>
    );
};
