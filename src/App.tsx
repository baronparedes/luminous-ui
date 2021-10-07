import React from 'react';
import {useDispatch} from 'react-redux';
import {RestfulProvider} from 'restful-react';

import {useRootState} from './store';
import {profileActions} from './store/reducers/profile.reducer';

const App: React.FC = props => {
  const dispatch = useDispatch();
  const {token} = useRootState(state => state.profile);
  return (
    <RestfulProvider
      base={process.env.REACT_APP_API_URI as string}
      onRequest={req => {
        if (token) {
          req.headers.append('Authorization', `Bearer ${token}`);
        }
      }}
      onError={err => {
        // Unauthorized
        if (err.status === 401) {
          dispatch(profileActions.signOut());
        }
      }}
    >
      <div id="content">
        {props.children}
        <span className="p-3" />
      </div>
    </RestfulProvider>
  );
};

export default App;
