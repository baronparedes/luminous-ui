import React from 'react';
import {useDispatch} from 'react-redux';
import {RestfulProvider} from 'restful-react';
import styled from 'styled-components';

import config from './config';
import {useRootState} from './store';
import {profileActions} from './store/reducers/profile.reducer';
import Footer from './components/@ui/Footer';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
`;

const App: React.FC = props => {
  const dispatch = useDispatch();
  const {token} = useRootState(state => state.profile);
  return (
    <RestfulProvider
      base={config.API_URI}
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
      <AppContainer id="content">
        <MainContent>{props.children}</MainContent>
        <Footer />
      </AppContainer>
    </RestfulProvider>
  );
};

export default App;
