import {useState} from 'react';
import {Button, ButtonProps, Col, Container, Row} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';

import {getCurrentMonthYear, getPastYears} from '../../../@utils/dates';
import {PropertyAttr, useGetTransactionHistory} from '../../../Api';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import SelectYear from '../../@ui/SelectYear';
import TransactionHistoryDetail from '../../@ui/TransactionHistoryDetail';
import PrintTransactionHistory from './PrintTransactionHistory';
import config from '../../../config';

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
  const years = getPastYears(config.HISTORY_YEARS).sort().reverse();

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
            <Row>
              <Col>
                <SelectYear
                  availableYears={years}
                  value={selectedYear}
                  onSelectYear={setSelectedYear}
                  size="lg"
                />
              </Col>
              {data && (
                <Col md={2} sm={4}>
                  <div className="text-right mb-3">
                    <PrintTransactionHistory
                      property={property}
                      data={data}
                      buttonLabel={<FaPrint />}
                      className="w-100"
                    />
                  </div>
                </Col>
              )}
            </Row>
          </Container>
          {loading && <Loading />}
          {!loading && data && (
            <>
              <TransactionHistoryDetail data={data} />
            </>
          )}
        </div>
      </ModalContainer>
    </>
  );
};

export default ViewTransactionHistory;
