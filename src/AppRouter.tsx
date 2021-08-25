import React from 'react';
import {Route, Switch} from 'react-router-dom';

import routes from './@utils/routes';
import Header from './components/@ui/Header';
import NotFound from './components/@ui/NotFound';
import LoginView from './components/profile/LoginView';

const AppRouter: React.FC = () => {
  return (
    <Switch>
      <Route path={routes.LOGIN} exact component={LoginView} />
      <Route>
        <Header />
        <Switch>
          <Route component={NotFound} />
        </Switch>
      </Route>
    </Switch>
  );
};

export default AppRouter;
