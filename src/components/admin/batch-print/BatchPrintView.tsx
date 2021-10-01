import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';
import {Prompt} from 'react-router-dom';
import {useReactToPrint} from 'react-to-print';

import {ApprovedAny} from '../../../@types';
import {Period, useGetPropertyAccountsByPeriod} from '../../../Api';
import {SETTING_KEYS} from '../../../constants';
import {useRootState} from '../../../store';
import Loading from '../../@ui/Loading';
import {PrintPaper} from '../../@ui/PaperPdf';
import RoundedPanel from '../../@ui/RoundedPanel';
import SelectPeriod from '../../@ui/SelectPeriod';
import SOA from '../../@ui/SOA';

const BatchPrintView = () => {
  const notes = useRootState(state =>
    state.setting.values.find(v => v.key === SETTING_KEYS.SOA_NOTES)
  );
  const [selectedPeriod, setSelectedPeriod] = useState<Period>();
  const [inProgress, setInProgress] = useState(false);
  const {data, loading, refetch} = useGetPropertyAccountsByPeriod({
    lazy: true,
  });
  const printPaperRef = React.createRef<ApprovedAny>();
  const handlePrint = useReactToPrint({
    bodyClass: 'print-body',
    content: () => printPaperRef.current,
    documentTitle: `${selectedPeriod?.year} - ${selectedPeriod?.month}`,
  });
  const handleOnSelect = (period: Period) => {
    if (confirm('Start Process?')) {
      refetch({
        queryParams: {
          year: period.year,
          month: period.month,
        },
      });
      setSelectedPeriod(period);
      setInProgress(true);
    }
  };

  useEffect(() => {
    if (data) {
      setInProgress(false);
      handlePrint && handlePrint();
    }
  }, [data]);

  return (
    <>
      <Prompt
        when={inProgress}
        message={() =>
          'Leaving or refreshing the page will interrupt the current process. Proceed?'
        }
      />
      <Container>
        <RoundedPanel className="p-4">
          <h5 className="pl-2">Select a period</h5>
          <SelectPeriod
            onPeriodSelect={handleOnSelect}
            buttonLabel="render"
            disabled={inProgress || loading}
          />
        </RoundedPanel>
        {loading && <Loading />}
        {selectedPeriod && !loading && data && (
          <RoundedPanel className="p-3 mt-2">
            <Container>
              <Row>
                <Col md={9}>
                  <h5>Rendered {data.length} properties for printing</h5>
                </Col>
                <Col className="text-right">
                  <Button
                    size="sm"
                    className="w-100"
                    onClick={() => handlePrint && handlePrint()}
                  >
                    Reprint
                  </Button>
                </Col>
              </Row>
            </Container>
            <div className="d-none">
              <PrintPaper ref={printPaperRef}>
                {data.map((item, i) => {
                  return (
                    <SOA
                      key={i}
                      propertyAccount={item}
                      notes={notes}
                      {...selectedPeriod}
                    />
                  );
                })}
              </PrintPaper>
            </div>
          </RoundedPanel>
        )}
      </Container>
    </>
  );
};

export default BatchPrintView;
