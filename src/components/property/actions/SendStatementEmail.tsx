import React, {useState} from 'react';
import {Button, ButtonProps, Container, Form} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';

import {getCurrentMonthYear} from '../../../@utils/dates';
import {
  Month,
  useGetAvailablePeriods,
  useSendStatementEmail,
} from '../../../Api';
import {useAvailablePeriods} from '../../../hooks/useAvailablePeriods';
import ErrorInfo from '../../@ui/ErrorInfo';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import SelectYear from '../../@ui/SelectYear';

type Props = {
  propertyId: number;
  buttonLabel: string;
  propertyOwnerEmails?: string[];
};

const SendStatementEmail = ({
  propertyId,
  buttonLabel,
  propertyOwnerEmails,
  ...buttonProps
}: Props & Omit<ButtonProps, 'property'>) => {
  const {year, month} = getCurrentMonthYear();

  const [toggle, setToggle] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<Month>(month);
  const [selectedYear, setSelectedYear] = useState<number>(year);
  const [success, setSuccess] = useState(false);

  const {data: periodsData, loading: periodsLoading} = useGetAvailablePeriods({
    propertyId,
  });
  const {mutate, loading, error} = useSendStatementEmail({});

  const handleClose = () => {
    setToggle(false);
    setEmail('');
    setSuccess(false);
  };

  const handleSend = async () => {
    if (!email) {
      return;
    }

    mutate({
      propertyId,
      email,
      year: selectedYear,
      month: selectedMonth,
    })
      .then(() => {
        setSuccess(true);
      })
      .catch((err: Error) => {
        console.error('Failed to send email:', err);
      });
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canSend = email && isValidEmail(email) && !loading && !success;

  const {availableYears, months} = useAvailablePeriods({
    periodsData: periodsData || undefined,
    selectedYear,
  });

  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        header={<h5>Send Statement via Email</h5>}
        toggle={toggle}
        onClose={handleClose}
      >
        <div className="m-2 pb-3">
          {loading && <Loading />}
          {!loading && !success && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Recipient Email Address</Form.Label>
                <Typeahead
                  id="email-typeahead"
                  options={propertyOwnerEmails || []}
                  placeholder="Enter email address"
                  onChange={selected => {
                    if (selected.length > 0) {
                      setEmail(selected[0] as string);
                    }
                  }}
                  onInputChange={inputValue => setEmail(inputValue)}
                  selected={email ? [email] : []}
                  isInvalid={email.length > 0 && !isValidEmail(email)}
                  allowNew={false}
                  emptyLabel="No suggested emails"
                />
                {email.length > 0 && !isValidEmail(email) && (
                  <Form.Text className="text-danger">
                    Please enter a valid email address
                  </Form.Text>
                )}
                {propertyOwnerEmails && propertyOwnerEmails.length > 0 && (
                  <Form.Text className="text-muted">
                    Suggested: {propertyOwnerEmails.join(', ')}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Period</Form.Label>
                {periodsLoading && <Loading />}
                {!periodsLoading && (
                  <>
                    <Container className="m-0 p-0 pb-3">
                      <SelectYear
                        availableYears={availableYears}
                        value={selectedYear}
                        onSelectYear={setSelectedYear}
                      />
                    </Container>
                    <Form.Control
                      as="select"
                      value={selectedMonth}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setSelectedMonth(e.target.value as Month)
                      }
                    >
                      {months.map(m => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </Form.Control>
                  </>
                )}
              </Form.Group>

              {error && (
                <ErrorInfo>{error.message || 'Failed to send email'}</ErrorInfo>
              )}

              <div className="text-right mt-3">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSend}
                  disabled={!canSend}
                >
                  Send Email
                </Button>
              </div>
            </>
          )}
          {success && (
            <div className="text-center p-4">
              <div className="text-success mb-3">
                <i className="fas fa-check-circle fa-3x" />
              </div>
              <h5>Email Sent Successfully!</h5>
              <p className="text-muted">
                The statement has been sent to {email} for {selectedMonth}{' '}
                {selectedYear}.
              </p>
              <Button variant="primary" onClick={handleClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </ModalContainer>
    </>
  );
};

export default SendStatementEmail;
