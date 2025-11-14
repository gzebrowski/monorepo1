import './styles.scss';

import AdminPanelBody from './components/AdminPanelBody';
import { AdminAlertProvider } from './context/adminAlerts';

export function AdminPanel() {
    return (
        <div className="admin-panel">
            <AdminAlertProvider>
                <AdminPanelBody />
            </AdminAlertProvider>
        </div>
    );
}
