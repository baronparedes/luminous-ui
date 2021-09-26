import './@assets/styles/theme.scss';
import './index.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import App from './App';
import AppRouter from './AppRouter';
import reportWebVitals from './reportWebVitals';
import store from './store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </App>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
