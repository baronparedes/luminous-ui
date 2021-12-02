import {useState} from 'react';
import {Container} from 'react-bootstrap';

import {getCurrentMonthYear, getPastYears} from '../../@utils/dates';
import {useGetDashboardByYear} from '../../Api';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';
import SelectYear from '../@ui/SelectYear';
import {Spacer} from '../@ui/Spacer';
import BalanceSummary from './BalanceSummary';
import CollectionEfficiency from './CollectionEfficiency';
import PropertyBalance from './PropertyBalance';

const DashboardView = () => {
  const {year} = getCurrentMonthYear();
  const years = getPastYears(5).sort().reverse();

  const [selectedYear, setSelectedYear] = useState<number>(year);
  const {data, loading} = useGetDashboardByYear({year: selectedYear});

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Container>
        <BalanceSummary />
        {data && (
          <>
            <Spacer />
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
            <CollectionEfficiency data={data?.collectionEfficieny} />
          </>
        )}
      </Container>
    </>
  );
};

export default DashboardView;
