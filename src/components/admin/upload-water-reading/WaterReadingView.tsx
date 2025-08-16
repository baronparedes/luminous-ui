import {useEffect, useState} from 'react';
import {Alert, Button, Col, Container, Form, Row} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {Prompt} from 'react-router-dom';

import {ApprovedAny} from '../../../@types';
import {getCurrentMonthYear} from '../../../@utils/dates';
import {sanitizeTransaction} from '../../../@utils/helpers';
import {
  Period,
  useGetAllCharges,
  useGetAllProperties,
  useGetWaterReadingByPeriod,
  usePostTransactions,
} from '../../../Api';
import {
  useSettings,
  useWaterReadingDataTransformer,
  useWaterReadingFile,
} from '../../../hooks';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import RoundedPanel from '../../@ui/RoundedPanel';
import SelectPeriod from '../../@ui/SelectPeriod';
import WaterReadingTransactions from './WaterReadingTransactions';

type FormData = {
  file: ApprovedAny;
  sheet?: string;
};

const WaterReadingView = () => {
  const currentPeriod = getCurrentMonthYear();
  const [toggle, setToggle] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(currentPeriod);
  const [selectedFile, setSelectedFile] = useState<FileList>();
  const [selectedSheet, setSelectedSheet] = useState<string>();
  const {control, handleSubmit, reset} = useForm<FormData>({
    defaultValues: {
      sheet: '',
    },
  });

  const {mutate, loading: inProgress} = usePostTransactions({});
  const {data: charges, loading: loadingCharges} = useGetAllCharges({});
  const {data: properties, loading: loadingProperties} = useGetAllProperties(
    {}
  );
  const {
    chargeIds: {waterChargeId},
  } = useSettings();
  const {sheets, data} = useWaterReadingFile(
    selectedFile ? selectedFile[0] : undefined,
    selectedSheet
  );
  const {transactions, parseErrors, parseMismatch, error} =
    useWaterReadingDataTransformer(data, charges, properties, selectedPeriod);

  const {
    data: waterReadingTransactions,
    refetch: refetchWaterReadingTransactions,
  } = useGetWaterReadingByPeriod({
    year: selectedPeriod?.year,
    month: selectedPeriod?.month,
    lazy: true,
  });

  const hasWaterReadingForSelectedPeriod =
    waterReadingTransactions && waterReadingTransactions.length > 0;

  const onReset = (period?: Period, showModal = false) => {
    reset();
    setSelectedFile(undefined);
    setSelectedSheet(undefined);
    setSelectedPeriod(period ?? currentPeriod);
    setToggle(showModal);
  };

  const onSubmit = (formData: FormData) => {
    if (confirm('Proceed?')) {
      setSelectedSheet(formData.sheet);
      setToggle(false);
    }
  };

  const handleOnSelect = (period: Period) => {
    onReset(period, true);
  };

  const handleOnSaveTransactions = () => {
    const confirmMessage = `Upload transactions for the period of ${selectedPeriod?.year}-${selectedPeriod?.month}`;
    if (confirm(confirmMessage)) {
      const transactionsToBeSaved = transactions.map(t =>
        sanitizeTransaction(t)
      );
      mutate(transactionsToBeSaved).then(() => {
        onReset();
        alert('Transactions uploaded successfully');
      });
    }
  };

  useEffect(() => {
    refetchWaterReadingTransactions();
  }, [selectedPeriod]);

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
          <h5 className="pl-2">Upload water reading for the period of</h5>
          <SelectPeriod
            onPeriodSelect={handleOnSelect}
            buttonLabel="select file"
            disabled={
              toggle ||
              loadingCharges ||
              loadingProperties ||
              inProgress ||
              !waterChargeId
            }
          />
          {!waterChargeId && (
            <Alert variant="warning" className="mt-3">
              <strong>Water charge ID not configured!</strong>
              <br />
              Please configure the water charge ID in the settings before
              uploading water readings. Contact your administrator if you need
              assistance.
            </Alert>
          )}
          <ModalContainer
            toggle={toggle}
            onClose={() => setToggle(false)}
            header={
              <h5>
                Select a file to upload for {selectedPeriod?.year}-
                {selectedPeriod?.month}
              </h5>
            }
          >
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="form-file-to-upload">
                <Controller
                  name="file"
                  control={control}
                  render={({field}) => (
                    <Form.File
                      {...field}
                      onChange={(e: ApprovedAny) => {
                        field.onChange(e);
                        setSelectedFile(e.currentTarget.files ?? undefined);
                      }}
                      label="select file to upload"
                      accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                      required
                    />
                  )}
                />
                <Form.Text className="text-muted">
                  Only formatted water reading file is accepted
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="form-sheet-name">
                <Controller
                  name="sheet"
                  control={control}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      required
                      as="select"
                      placeholder="sheet name"
                    >
                      <option value="">select sheet name</option>
                      {sheets.map((s, i) => {
                        return (
                          <option value={s} key={i}>
                            {s}
                          </option>
                        );
                      })}
                    </Form.Control>
                  )}
                />
              </Form.Group>
              {hasWaterReadingForSelectedPeriod && (
                <>
                  <Alert variant="warning">
                    Water Reading found for the selected period.
                  </Alert>
                </>
              )}
              <hr />
              <div className="text-right">
                <Button
                  type="submit"
                  variant={
                    hasWaterReadingForSelectedPeriod ? 'warning' : 'primary'
                  }
                  disabled={!waterChargeId}
                >
                  Process
                </Button>
              </div>
            </Form>
          </ModalContainer>
        </RoundedPanel>
        {inProgress && <Loading className="pt-3" />}
        {!error && parseErrors.length > 0 && (
          <>
            <RoundedPanel className="mt-3 p-3">
              <h6 className="text-muted">
                No reading found for the following properties
              </h6>
              <strong className="text-danger">
                <p>{parseErrors.join(',')}</p>
              </strong>
            </RoundedPanel>
          </>
        )}
        {!error && parseMismatch.length > 0 && (
          <>
            <RoundedPanel className="mt-3 p-3">
              <h6 className="text-muted">
                The following properties were not found in the masterlist
              </h6>
              <strong className="text-danger">
                <p>{parseMismatch.join(',')}</p>
              </strong>
            </RoundedPanel>
          </>
        )}
        {!error && transactions.length > 0 && (
          <>
            {hasWaterReadingForSelectedPeriod && (
              <>
                <Alert className="mt-3" variant="warning">
                  Water Reading found for the selected period. Saving this
                  transaction may result to duplicate entries.
                </Alert>
              </>
            )}
            <WaterReadingTransactions
              transactions={transactions}
              renderHeaderContent={
                <>
                  <Row>
                    <Col>
                      <div className="center-content">
                        <h5 className="m-auto">
                          Review Transactions to Upload
                        </h5>
                        <h5 className="pt-1">
                          {`${transactions.length} of ${properties?.length} for  the period of ${selectedPeriod?.year}-${selectedPeriod?.month}`}
                        </h5>
                      </div>
                    </Col>
                    <Col className="text-right">
                      <Button
                        disabled={inProgress}
                        variant={
                          hasWaterReadingForSelectedPeriod ? 'warning' : 'info'
                        }
                        onClick={handleOnSaveTransactions}
                      >
                        Save Transactions
                      </Button>
                    </Col>
                  </Row>
                </>
              }
            />
          </>
        )}
      </Container>
    </>
  );
};

export default WaterReadingView;
