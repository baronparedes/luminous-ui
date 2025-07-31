import {useState} from 'react';
import {Container, Tab, TabContainer, Tabs} from 'react-bootstrap';

import {getCurrentMonthYear, getPastYears} from '../../@utils/dates';
import {useGetAllCharges, useGetDashboardByYear} from '../../Api';
import {useChargeBalance} from '../../hooks/useChargeBalance';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';
import SelectYear from '../@ui/SelectYear';
import {Spacer} from '../@ui/Spacer';
import BalanceSummary from './BalanceSummary';
import CategorizedExpense from './CategorizedExpense';
import ChargeDisbrused from './ChargeDisbrused';
import CollectionEfficiency from './CollectionEfficiency';
import CollectionEfficiencyByCharge from './CollectionEfficiencyByCharge';
import ExpenseOverRevenue from './ExpenseOverRevenue';
import PropertyBalance from './PropertyBalance';
import config from '../../config';

const DashboardView = () => {
  const {year} = getCurrentMonthYear();
  const years = getPastYears(config.DASHBOARD_YEARS).sort().reverse();

  const [selectedYear, setSelectedYear] = useState<number>(year);

  const {data, loading} = useGetDashboardByYear({year: selectedYear});
  const {availableBalances, availableCommunityBalance} = useChargeBalance();
  const {data: charges} = useGetAllCharges({});

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
            <PropertyBalance
              data={data.propertyBalance}
              breakdownData={data.propertyBalanceByCharge}
              charges={charges}
            />
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
                  <CollectionEfficiency data={data.collectionEfficieny} />
                </Tab>
                <Tab
                  eventKey="collection-breakdown"
                  title="Collection Breakdown"
                >
                  <CollectionEfficiencyByCharge
                    data={data.collectionEfficieny}
                    charges={charges}
                  />
                </Tab>
                <Tab eventKey="charge-disbrusements" title="Disbursements">
                  <ChargeDisbrused
                    header={availableCommunityBalance.code}
                    data={data.chargeDisbursed.filter(
                      c =>
                        c.chargeId === availableCommunityBalance.chargeId &&
                        c.amount > 0
                    )}
                  />
                  {availableBalances.map(chargeBalance => {
                    const items = data.chargeDisbursed.filter(
                      c => c.chargeId === chargeBalance.chargeId && c.amount > 0
                    );
                    return (
                      <>
                        <Spacer />
                        <ChargeDisbrused
                          header={chargeBalance.code}
                          data={items}
                        />
                      </>
                    );
                  })}
                </Tab>
                <Tab eventKey="categorized-expenses" title="Expenses">
                  <CategorizedExpense data={data.categorizedExpense} />
                </Tab>
                <Tab
                  eventKey="expense-over-revenues"
                  title="Expense Over Revenue"
                >
                  <ExpenseOverRevenue
                    selectedYear={selectedYear}
                    collectionEfficieny={data.collectionEfficieny}
                    categorizedExpense={data.categorizedExpense}
                    charges={charges}
                  />
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
