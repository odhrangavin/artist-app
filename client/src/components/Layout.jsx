import Header from '../containers/Header/Header';
import Footer from '../containers/Footer/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="layout">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
