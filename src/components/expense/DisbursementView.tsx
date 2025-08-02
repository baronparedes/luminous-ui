import * as React from 'react';
import {Container, Tab, TabContainer, Tabs} from 'react-bootstrap';
import {useChargeBalance} from '../../hooks';
import ChargeDisbursement from './ChargeDisbursement';

const DisbursementView = () => {
  const {availableBalances, availableCommunityBalance} = useChargeBalance();

  return (
    <>
      <Container>
        <TabContainer>
          <Tabs className="mb-3">
            <Tab eventKey={0} title={availableCommunityBalance.code}>
              <ChargeDisbursement {...availableCommunityBalance} />
            </Tab>
            {availableBalances &&
              availableBalances.map(chargeBalance => {
                return (
                  <Tab
                    eventKey={Number(chargeBalance.chargeId)}
                    key={chargeBalance.chargeId}
                    title={chargeBalance.code}
                  >
                    <ChargeDisbursement {...chargeBalance} />
                  </Tab>
                );
              })}
          </Tabs>
        </TabContainer>
      </Container>
    </>
  );
};

export default DisbursementView;
