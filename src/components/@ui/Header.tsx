import React from 'react';

import HeaderPanel from './HeaderPanel';
import Navigation from './Navigation';

const Header: React.FC = () => {
  return (
    <HeaderPanel>
      <Navigation />
    </HeaderPanel>
  );
};

export default Header;
