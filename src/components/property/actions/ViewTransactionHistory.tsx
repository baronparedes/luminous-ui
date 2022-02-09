import {useState} from 'react';
import {Button, ButtonProps, Container} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';

import {getCurrentMonthYear, getPastYears} from '../../../@utils/dates';
import {PropertyAttr, useGetTransactionHistory} from '../../../Api';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import SelectYear from '../../@ui/SelectYear';
import TransactionHistoryDetail from '../../@ui/TransactionHistoryDetail';
import PrintTransactionHistory from './PrintTransactionHistory';

type Props = {
  property: PropertyAttr;
  buttonLabel: string;
};

const ViewTransactionHistory = ({
  property,
  buttonLabel,
  ...buttonProps
}: Props & Omit<ButtonProps, 'property'>) => {
  const propertyId = Number(property?.id);
  const {year} = getCurrentMonthYear();
  const years = getPastYears(3).sort().reverse();

  const [selectedYear, setSelectedYear] = useState<number>(year);
  const [toggle, setToggle] = useState(false);

  const {data, loading} = useGetTransactionHistory({
    propertyId,
    year: selectedYear,
  });

  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        size="lg"
        header={<h5>View Transaction History</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <div className="m-2 pb-3">
          <Container className="m-0 p-0 pb-3">
            <SelectYear
              availableYears={years}
              value={selectedYear}
              onSelectYear={setSelectedYear}
              size="lg"
            />
          </Container>

          {loading && <Loading />}
          {!loading && data && (
            <>
              <div className="text-right mb-3">
                <PrintTransactionHistory
                  property={property}
                  data={data}
                  buttonLabel={<FaPrint />}
                />
              </div>
              <TransactionHistoryDetail data={data} />
            </>
          )}
        </div>
      </ModalContainer>
    </>
  );
};

export default ViewTransactionHistory;
