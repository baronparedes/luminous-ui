import {useState} from 'react';
import {Container, Tab, TabContainer, Tabs} from 'react-bootstrap';

import {getCurrentMonthYear, getPastYears} from '../../@utils/dates';
import {useGetDashboardByYear} from '../../Api';
import {useChargeBalance} from '../../hooks/useChargeBalance';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';
import SelectYear from '../@ui/SelectYear';
import {Spacer} from '../@ui/Spacer';
import BalanceSummary from './BalanceSummary';
import ChargeExpense from './ChargeExpense';
import CollectionEfficiency from './CollectionEfficiency';
import PropertyBalance from './PropertyBalance';

const DashboardView = () => {
  const {year} = getCurrentMonthYear();
  const years = getPastYears(5).sort().reverse();

  const [selectedYear, setSelectedYear] = useState<number>(year);

  const {data, loading} = useGetDashboardByYear({year: selectedYear});
  const {availableBalances, availableCommunityBalance} = useChargeBalance();

  return (
    <>
      <Container className="pb-4">
        <BalanceSummary
          availableBalances={availableBalances}
          availableCommunityBalance={availableCommunityBalance}
        />
        <Spacer />
        {loading && <Loading />}
        {data && !loading && (
          <>
            <PropertyBalance data={data?.propertyBalance} />
            <Spacer />
            <RoundedPanel className="p-3">
              <SelectYear
                availableYears={years}
                value={selectedYear}
                onSelectYear={setSelectedYear}
                size="lg"
              />
            </RoundedPanel>
            <Spacer />
            <TabContainer>
              <Tabs defaultActiveKey="collection" className="mb-3">
                <Tab eventKey="collection" title="Collection">
                  <CollectionEfficiency data={data?.collectionEfficieny} />
                </Tab>
                <Tab eventKey="expense" title="Expenses">
                  <ChargeExpense
                    header={availableCommunityBalance.code}
                    data={data?.chargeExpense.filter(
                      c => c.chargeId === availableCommunityBalance.chargeId
                    )}
                  />
                  {availableBalances.map(chargeBalance => {
                    return (
                      <>
                        <Spacer />
                        <ChargeExpense
                          header={chargeBalance.code}
                          data={data?.chargeExpense.filter(
                            c => c.chargeId === chargeBalance.chargeId
                          )}
                        />
                      </>
                    );
                  })}
                </Tab>
              </Tabs>
            </TabContainer>
          </>
        )}
      </Container>
    </>
  );
};

export default DashboardView;
