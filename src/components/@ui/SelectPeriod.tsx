import {Button, ButtonProps, Col, Form, InputGroup, Row} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';

import {getCurrentMonthYear, getPastYears} from '../../@utils/dates';
import {Period} from '../../Api';
import {MONTHS} from '../../constants';
import config from '../../config';

type Props = {
  onPeriodSelect: (period: Period) => void;
  buttonLabel?: string;
};

const SelectPeriod = ({
  onPeriodSelect,
  buttonLabel,
  ...buttonProps
}: Props & ButtonProps) => {
  const years = getPastYears(config.PROCESS_YEARS).map(year => year.toString());
  const initialValue = getCurrentMonthYear();
  const {handleSubmit, control} = useForm<Period>({
    defaultValues: initialValue,
  });
  return (
    <>
      <Form onSubmit={handleSubmit(onPeriodSelect)} role="form">
        <Row className="p-2">
          <Col>
            <Controller
              name="year"
              control={control}
              render={({field}) => (
                <InputGroup className="mb-2">
                  <Form.Label htmlFor="year" column sm={3}>
                    year
                  </Form.Label>
                  <Form.Control
                    as="select"
                    {...field}
                    id="year"
                    required
                    placeholder="year"
                    disabled={buttonProps.disabled}
                  >
                    {years.map((s, i) => {
                      return (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      );
                    })}
                  </Form.Control>
                </InputGroup>
              )}
            />
          </Col>
          <Col>
            <Controller
              name="month"
              control={control}
              render={({field}) => (
                <InputGroup className="mb-2">
                  <Form.Label htmlFor="month" column sm={3}>
                    month
                  </Form.Label>
                  <Form.Control
                    as="select"
                    {...field}
                    id="month"
                    required
                    placeholder="month"
                    disabled={buttonProps.disabled}
                  >
                    {MONTHS.map((s, i) => {
                      return (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      );
                    })}
                  </Form.Control>
                </InputGroup>
              )}
            />
          </Col>
          <Col md={2}>
            <Button type="submit" className="w-100" {...buttonProps}>
              {buttonLabel ?? 'select'}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default SelectPeriod;
