import React, {useEffect, useState} from 'react';
import {Button, ButtonProps, Container, ListGroup} from 'react-bootstrap';
import {useReactToPrint} from 'react-to-print';

import {ApprovedAny} from '../../../@types';
import {getCurrentMonthYear} from '../../../@utils/dates';
import {
  Month,
  Period,
  useGetAvailablePeriods,
  useGetPropertyAccount,
} from '../../../Api';
import {VERBIAGE} from '../../../constants';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import SelectYear from '../../@ui/SelectYear';
import PaperStatementOfAccount from '../PaperStatementOfAccount';

type Props = {
  propertyId: number;
  buttonLabel: string;
};

const ViewPreviousStatements = ({
  propertyId,
  buttonLabel,
  ...buttonProps
}: Props & ButtonProps) => {
  const {year, month} = getCurrentMonthYear();

  const [selectedYear, setSelectedYear] = useState<number>(year);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>();
  const [toggle, setToggle] = useState(false);

  const {data, loading} = useGetAvailablePeriods({propertyId});
  const {
    data: propertyAccount,
    refetch: refetchPropertyAccount,
    loading: propertyAccountLoading,
  } = useGetPropertyAccount({
    propertyId,
    lazy: true,
  });

  const printPaperRef = React.createRef<ApprovedAny>();
  const handlePrint = useReactToPrint({
    bodyClass: 'print-body',
    content: () => printPaperRef.current,
    documentTitle: selectedPeriod
      ? VERBIAGE.SOA.DOC_TITLE(propertyAccount?.property?.code, selectedPeriod)
      : 'SOA',
  });

  const availableYears = data ? [...new Set(data.map(f => f.year))] : [];
  const periods =
    data?.filter(d => {
      // TODO: for some reason d.year !== year && d.month !== month does not work
      return `${d.year}${d.month}` !== `${year}${month}`;
    }) ?? [];

  const handleSelectPeriod = (period: Period) => {
    if (JSON.stringify(selectedPeriod) === JSON.stringify(period)) {
      handlePrint && handlePrint();
      return;
    }
    setSelectedPeriod({...period});
    refetchPropertyAccount({
      queryParams: {
        month: period.month,
        year: period.year,
      },
    });
  };

  useEffect(() => {
    propertyAccount && handlePrint && handlePrint();
  }, [JSON.stringify(propertyAccount)]);

  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        header={<h5>View Previous Statements</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        {loading && <Loading />}
        {!loading && data && (
          <div className="m-2 pb-3">
            <Container className="m-0 p-0 pb-3">
              <SelectYear
                availableYears={availableYears}
                value={selectedYear}
                onSelectYear={setSelectedYear}
                size="lg"
              />
            </Container>
            <ListGroup>
              {periods
                .filter(p => p.year === selectedYear)
                .map((period, i) => {
                  return (
                    <ListGroup.Item
                      disabled={propertyAccountLoading}
                      variant="primary"
                      action
                      className="text-center"
                      key={i}
                      onClick={() => handleSelectPeriod(period)}
                    >
                      <h4>{`${period.year} ${period.month}`}</h4>
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          </div>
        )}
        <PaperStatementOfAccount
          ref={printPaperRef}
          propertyAccount={propertyAccount}
          month={selectedPeriod?.month as Month}
          year={Number(selectedPeriod?.year)}
        />
      </ModalContainer>
    </>
  );
};

export default ViewPreviousStatements;
