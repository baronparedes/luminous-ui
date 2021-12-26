import {Form, InputGroup} from 'react-bootstrap';

import {getMonthsUpToCurrent} from '../../@utils/dates';
import {Month} from '../../Api';

type Props = {
  value: Month;
  onSelectMonth: (month: Month) => void;
  size?: 'sm' | 'lg';
};

const SelectMonth = ({value, onSelectMonth, size}: Props) => {
  const months = getMonthsUpToCurrent();
  const handleOnSelectMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectMonth(e.target.value as Month);
  };

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
          {months.map((s, i) => {
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
