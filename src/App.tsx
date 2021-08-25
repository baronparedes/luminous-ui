import React from 'react';
import {RestfulProvider} from 'restful-react';

const App: React.FC = props => {
  return (
    <RestfulProvider base={process.env.REACT_APP_API_URI as string}>
      <div id="content">
        {props.children}
        <span className="p-3" />
      </div>
    </RestfulProvider>
  );
};

export default App;
