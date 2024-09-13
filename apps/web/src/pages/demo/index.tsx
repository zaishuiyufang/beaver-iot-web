import ConfigPlugin from '@milesight/shared/plugin/config-plugin';

function App() {
    return (
        <div className="ms-page-demo">
            <ConfigPlugin config={{ type: 'trigger' }} />
        </div>
    );
}

export default App;
