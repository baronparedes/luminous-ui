import React from 'react';
import {Redirect, Route, RouteProps} from 'react-router-dom';

import routes from '../../@utils/routes';
import {ProfileType} from '../../Api';
import {useRootState} from '../../store';

type Props = {
  exact?: boolean;
  path?: string;
  onlyFor?: ProfileType[];
  component: React.ComponentType<RouteProps>;
};

const ProtectedRoute = ({component: Component, onlyFor, ...rest}: Props) => {
  const profile = useRootState(state => state.profile);
  const hasAccess = () => {
    if (!onlyFor && !profile.me) {
      return true;
    }
    if (onlyFor && profile.me) {
      return onlyFor.includes(profile.me?.type);
    }
    return false;
  };

  return (
    <Route
      {...rest}
      render={props => (
        <>
          {profile.token && hasAccess() ? (
            <Component {...props} />
          ) : (
            <Redirect to={routes.LOGIN} />
          )}
        </>
      )}
    />
  );
};

export default ProtectedRoute;
