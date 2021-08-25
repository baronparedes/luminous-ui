import React from 'react';
import {Route, Switch} from 'react-router-dom';

import Header from './components/@ui/Header';
import NotFound from './components/@ui/NotFound';

const AppRouter: React.FC = () => {
  return (
    <Switch>
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
