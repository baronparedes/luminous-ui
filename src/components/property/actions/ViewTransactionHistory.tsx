import {useState} from 'react';
import {Button, ButtonProps, Container} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';

import {
  getCurrentMonthYear,
  getPastYears,
  toTransactionPeriodFromDate,
} from '../../../@utils/dates';
import {sum} from '../../../@utils/helpers';
import {PropertyAttr, useGetTransactionHistory} from '../../../Api';
import {Currency} from '../../@ui/Currency';
import {LabeledCurrency} from '../../@ui/LabeledCurrency';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import SelectYear from '../../@ui/SelectYear';
import {Table} from '../../@ui/Table';
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

  const totalCharges = sum(
    data?.filter(d => d.transactionType === 'charged')?.map(d => d.amount)
  );
  const totalCollected = sum(
    data?.filter(d => d.transactionType === 'collected')?.map(d => d.amount)
  );
  const balance = totalCharges - totalCollected;

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
              <Container className="text-right mb-3">
                <div className="text-right mb-3">
                  <PrintTransactionHistory
                    year={year}
                    property={property}
                    transactionHistory={data}
                    buttonLabel={<FaPrint />}
                  />
                </div>
                <LabeledCurrency
                  label="running balance"
                  pill
                  variant="info"
                  noCurrencyColor
                  currency={balance}
                />
              </Container>
              <Table
                headers={['charge code', 'month', 'type', 'amount']}
                size="sm"
              >
                <tbody>
                  {data &&
                    data.map((t, i) => {
                      const period = toTransactionPeriodFromDate(
                        t.transactionPeriod
                      );
                      return (
                        <tr key={i}>
                          <td>{t.charge?.code}</td>
                          <td>{`${period.month}`}</td>
                          <td>{t.transactionType}</td>
                          {t.transactionType === 'charged' && (
                            <td>
                              <strong>
                                <Currency noCurrencyColor currency={t.amount} />
                              </strong>
                            </td>
                          )}
                          {t.transactionType === 'collected' && (
                            <td>
                              <strong>
                                <Currency
                                  noCurrencyColor
                                  className="text-success"
                                  currency={t.amount * -1}
                                />
                              </strong>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </>
          )}
        </div>
      </ModalContainer>
    </>
  );
};

export default ViewTransactionHistory;
