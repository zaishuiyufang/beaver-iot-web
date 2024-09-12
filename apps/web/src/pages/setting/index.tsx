import { useState } from 'react';
import { Button } from '@mui/material';
import { toast } from '@milesight/shared/src/components';
import logo from '@/assets/logo.svg';
import styles from './index.module.less';
import './style.less';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="ms-page-demo">
            <div>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img src={logo} className="logo" alt="logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <Button onClick={() => setCount(count => count + 1)}>count is {count}</Button>
                <Button onClick={() => toast.error('Hello World')}>Toast</Button>
                <p>
                    Edit <code className={styles.red}>src/App.tsx</code> and save to test HMR
                </p>
            </div>
        </div>
    );
}

export default App;
