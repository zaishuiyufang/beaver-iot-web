import { Link, Outlet } from 'react-router-dom';

function BasicLayout() {
    return (
        <section className="ms-layout">
            <header>
                Header:{' '}
                <nav style={{ display: 'inline-block' }}>
                    <Link to="/">Home</Link> | <Link to="/about">About</Link> |{' '}
                    <Link to="/demo">Demo</Link> |<Link to="/auth/register">Register</Link> |{' '}
                    <Link to="/auth/login">Login</Link>
                </nav>
            </header>
            <main>
                <aside>Aside</aside>
                <section>
                    <Outlet />
                </section>
            </main>
            <footer>Footer</footer>
        </section>
    );
}

export default BasicLayout;
