import React from 'react';
import {Col, Container, Row, Tab, TabContainer, Tabs} from 'react-bootstrap';

import {SETTING_KEYS} from '../../../constants';
import RoundedPanel from '../../@ui/RoundedPanel';
import SettingBillingCutoff from './SettingBillingCutoff';
import SettingCharges from './SettingCharges';
import SettingExpenseCategory from './SettingExpenseCategory';
import SettingMarkup from './SettingMarkup';

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
        <TabContainer>
          <Tabs defaultActiveKey="charges" className="mb-3">
            <Tab eventKey="charges" title="Charge Rates">
              <SettingCharges />
            </Tab>
            <Tab eventKey="billing" title="Billing">
              <SettingBillingCutoff />
            </Tab>
            <Tab eventKey="soa-notes" title="SOA Notes">
              <SettingMarkup
                settingKey={SETTING_KEYS.SOA_NOTES}
                heading="Statement of Account"
              />
            </Tab>
            <Tab eventKey="pr-notes" title="PR Notes">
              <SettingMarkup
                settingKey={SETTING_KEYS.PR_NOTES}
                heading="Purchase Request"
              />
            </Tab>
            <Tab eventKey="expense-categories" title="Expense Categories">
              <SettingExpenseCategory />
            </Tab>
          </Tabs>
        </TabContainer>
      </Container>
    </>
  );
};

export default SettingsView;
