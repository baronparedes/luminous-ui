import {Container} from 'react-bootstrap';

import {useGetDashboardByYear} from '../../Api';
import Loading from '../@ui/Loading';
import {Spacer} from '../@ui/Spacer';
import BalanceSummary from './BalanceSummary';
import CollectionEfficiency from './CollectionEfficiency';
import PropertyBalance from './PropertyBalance';

const DashboardView = () => {
  const {data, loading} = useGetDashboardByYear({year: 2021});

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
            <CollectionEfficiency data={data?.collectionEfficieny} />
          </>
        )}
      </Container>
    </>
  );
};

export default DashboardView;
