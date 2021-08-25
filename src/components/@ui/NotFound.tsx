import React from 'react';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import routes from '../../@utils/routes';

const NotFound: React.FC = () => {
  return (
    <div className="text-center">
      <h2 style={{marginTop: '2em'}}>Page Not Found</h2>
      <Link to={routes.ROOT}>
        <Button>Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
