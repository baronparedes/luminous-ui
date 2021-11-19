import {Form, InputGroup} from 'react-bootstrap';

type Props = {
  value: number;
  availableYears: number[];
  onSelectYear: (year: number) => void;
  size?: 'sm' | 'lg';
};

const SelectYear = ({value, availableYears, onSelectYear, size}: Props) => {
  const handleSelectYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value);
    onSelectYear(year);
  };

  return (
    <>
      <InputGroup>
        <Form.Label htmlFor="selectedYear" column sm={3}>
          select year
        </Form.Label>
        <Form.Control
          size={size}
          as="select"
          id="selectedYear"
          name="selectedYear"
          onChange={handleSelectYear}
          value={value}
        >
          {availableYears.map((s, i) => {
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

export default SelectYear;
