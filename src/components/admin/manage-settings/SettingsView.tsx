import React from 'react';
import {Col, Container, Row} from 'react-bootstrap';

import RoundedPanel from '../../@ui/RoundedPanel';
import SettingBillingCutoff from './SettingBillingCutoff';
import SettingSOA from './SettingSOA';

export const SettingContainer: React.FC<{
  heading: string;
  renderRightContent?: React.ReactNode;
}> = ({heading, renderRightContent, children}) => {
  return (
    <RoundedPanel className="p-3 mb-3">
      <Row>
        <Col>
          <h5>{heading}</h5>
        </Col>
        <Col className="text-right">{renderRightContent}</Col>
      </Row>
      <hr />
      {children}
    </RoundedPanel>
  );
};

const SettingsView = () => {
  return (
    <>
      <Container>
        <SettingBillingCutoff />
        <SettingSOA />
      </Container>
    </>
  );
};

export default SettingsView;
