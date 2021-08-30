import React from 'react';
import {RestfulProvider} from 'restful-react';

import {useRootState} from './store';

const App: React.FC = props => {
  const {token} = useRootState(state => state.profile);
  return (
    <RestfulProvider
      base={process.env.REACT_APP_API_URI as string}
      onRequest={req => {
        if (token) {
          req.headers.append('Authorization', `Bearer ${token}`);
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
