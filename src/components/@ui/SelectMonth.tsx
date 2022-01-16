import {Form, InputGroup} from 'react-bootstrap';

import {Month} from '../../Api';
import {MONTHS} from '../../constants';

type Props = {
  value: Month;
  onSelectMonth: (month: Month) => void;
  size?: 'sm' | 'lg';
  months?: Month[];
};

const SelectMonth = ({value, onSelectMonth, size, months}: Props) => {
  const handleOnSelectMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectMonth(e.target.value as Month);
  };
  const targetMonths = months ?? MONTHS;

  return (
    <>
      <InputGroup className="mb-2 d-print-none">
        <Form.Label htmlFor="month" column sm={3}>
          select month
        </Form.Label>
        <Form.Control
          size={size}
          as="select"
          id="selectMonth"
          name="selectMonth"
          onChange={handleOnSelectMonth}
          value={value?.toString()}
        >
          {targetMonths.map((s, i) => {
            return (
              <option key={i} value={s}>
                {s}
              </option>
            );
          })}
        </Form.Control>
      </InputGroup>
    </>
  );
};

export default SelectMonth;
