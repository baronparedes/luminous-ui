import {Container, Tab, TabContainer, Tabs} from 'react-bootstrap';

import {usePassOnBalance} from '../../hooks/usePassOnBalance';
import ChargeDisbursement from './ChargeDisbursement';

const DisbursementView = () => {
  const {data} = usePassOnBalance();

  return (
    <>
      <Container>
        <TabContainer>
          <Tabs className="mb-3">
            <Tab eventKey={0} title="COMMUNITY EXPENSE">
              Comm Expense
            </Tab>
            {data &&
              data.map(d => {
                return (
                  <Tab
                    eventKey={Number(d.chargeId)}
                    key={d.chargeId}
                    title={d.code}
                  >
                    <ChargeDisbursement {...d} />
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
