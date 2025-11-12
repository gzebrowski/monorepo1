import React from 'react';

import AdminPanelBody from './components/AdminPanelBody';
import { AdminAlertProvider } from './context/adminAlerts';

export function AdminPanel() {
    return (
        <AdminAlertProvider>
            <AdminPanelBody />
        </AdminAlertProvider>
    );
}
