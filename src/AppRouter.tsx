import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import routes from './@utils/routes';
import Header from './components/@ui/Header';
import NotFound from './components/@ui/NotFound';
import ProtectedRoute from './components/@ui/ProtectedRoute';
import BatchPrintView from './components/admin/batch-print/BatchPrintView';
import BatchTransactionView from './components/admin/batch-transaction/BatchTransactionView';
import ProfilesView from './components/admin/manage-profiles/ProfilesView';
import PropertiesView from './components/admin/manage-properties/PropertiesView';
import SettingsView from './components/admin/manage-settings/SettingsView';
import WaterReadingView from './components/admin/upload-water-reading/WaterReadingView';
import DashboardView from './components/dashboard/DashboardView';
import PurchaseRequestsView from './components/expense/PurchaseRequestsView';
import LoginView from './components/profile/LoginView';
import MyProfileView from './components/profile/MyProfileView';
import PropertyView from './components/property/PropertyView';
import {useInitSettings} from './hooks/useInitSettings';
import {useRootState} from './store';

const AppRouter: React.FC = () => {
  useInitSettings();
  const {me} = useRootState(state => state.profile);
  if (!me) {
    <Redirect to={routes.LOGIN} />;
  }
  return (
    <Switch>
      <Route path={routes.LOGIN} exact component={LoginView} />
      <Route>
        <Header />
        <div className="m-2">
          <Switch>
            <ProtectedRoute
              path={routes.PROPERTY(':id')}
              component={PropertyView}
            />
            <ProtectedRoute
              path={routes.ROOT}
              exact
              component={MyProfileView}
            />
            <ProtectedRoute
              path={routes.DASHBOARD}
              exact
              onlyFor={['admin', 'stakeholder']}
              component={DashboardView}
            />
            <ProtectedRoute
              path={routes.EXPENSE_REQUESTS}
              exact
              onlyFor={['admin', 'stakeholder']}
              component={PurchaseRequestsView}
            />
            <ProtectedRoute
              path={routes.ADMIN_PROFILES}
              exact
              onlyFor={['admin']}
              component={ProfilesView}
            />
            <ProtectedRoute
              path={routes.ADMIN_PROPERTIES}
              exact
              onlyFor={['admin']}
              component={PropertiesView}
            />
            <ProtectedRoute
              path={routes.ADMIN_SETTINGS}
              exact
              onlyFor={['admin']}
              component={SettingsView}
            />
            <ProtectedRoute
              path={routes.ADMIN_BATCH_TRANSACTIONS}
              exact
              onlyFor={['admin']}
              component={BatchTransactionView}
            />
            <ProtectedRoute
              path={routes.ADMIN_BATCH_PRINT_SOA}
              exact
              onlyFor={['admin']}
              component={BatchPrintView}
            />
            <ProtectedRoute
              path={routes.ADMIN_UPLOAD_WATER_READING}
              exact
              onlyFor={['admin']}
              component={WaterReadingView}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Route>
    </Switch>
  );
};

export default AppRouter;
