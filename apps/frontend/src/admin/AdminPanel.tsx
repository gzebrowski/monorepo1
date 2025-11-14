import './styles.scss';

import AdminPanelBody from './components/AdminPanelBody';
import { AdminAlertProvider } from './context/adminAlerts';
import { ToastProvider } from './context/toasts';

export function AdminPanel() {
    return (
        <div className="admin-panel">
            <ToastProvider>
                <AdminAlertProvider>
                    <AdminPanelBody />
                </AdminAlertProvider>
            </ToastProvider>
        </div>
    );
}
