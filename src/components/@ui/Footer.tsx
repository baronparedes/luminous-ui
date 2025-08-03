import React from 'react';
import {Container} from 'react-bootstrap';
import styled from 'styled-components';

import {VERSION} from '../../version';

const FooterContainer = styled.footer`
  background-color: var(--light);
  color: var(--dark);
  padding: 1rem 0;
  border-top: 1px solid var(--border-color, #dee2e6);
  text-align: center;
  font-size: 0.875rem;
`;

const FooterContent = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <div>© {currentYear} Luminous. All rights reserved.</div>
        <div>Version {VERSION}</div>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
