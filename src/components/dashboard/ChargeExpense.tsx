import {Col, Row} from 'react-bootstrap';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {toTransactionPeriodFromDate} from '../../@utils/dates';
import {sum} from '../../@utils/helpers';
import {ChargeExpenseView, Month} from '../../Api';
import {MONTHS} from '../../constants';
import RoundedPanel from '../@ui/RoundedPanel';

type Props = {
  data: ChargeExpenseView[];
  header: string;
};

type ChartData = {
  period: string;
  total: number;
};

const ChargeExpense = ({data, header}: Props) => {
  const getAmount = (month: Month) => {
    const filtered = data
      .filter(
        d => toTransactionPeriodFromDate(d.transactionPeriod).month === month
      )
      .map(d => d.amount);
    return sum(filtered);
  };

  const chartData = MONTHS.map(m => {
    const result: ChartData = {
      period: m,
      total: getAmount(m),
    };
    return result;
  });

  return (
    <>
      <RoundedPanel className="p-4 text-center">
        <Row className="text-muted mb-2">
          <Col>{header}</Col>
        </Row>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              bottom: 5,
              left: 5,
              right: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </RoundedPanel>
    </>
  );
};

export default ChargeExpense;
