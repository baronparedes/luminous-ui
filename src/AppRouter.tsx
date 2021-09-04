import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import routes from './@utils/routes';
import Header from './components/@ui/Header';
import NotFound from './components/@ui/NotFound';
import ProtectedRoute from './components/@ui/ProtectedRoute';
import ProfilesView from './components/admin/manage-profiles/ProfilesView';
import PropertiesView from './components/admin/manage-properties/PropertiesView';
import DashboardView from './components/dashboard/DashboardView';
import LoginView from './components/profile/LoginView';
import {useRootState} from './store';

const AppRouter: React.FC = () => {
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
              path={routes.DASHBOARD}
              exact
              onlyFor={['admin', 'stakeholder']}
              component={DashboardView}
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
            <Route component={NotFound} />
          </Switch>
        </div>
      </Route>
    </Switch>
  );
};

export default AppRouter;
