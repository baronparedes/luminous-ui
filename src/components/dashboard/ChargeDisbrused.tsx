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
import {ChargeDisbursedView, Month} from '../../Api';
import {DEFAULTS, MONTHS} from '../../constants';
import RoundedPanel from '../@ui/RoundedPanel';

type Props = {
  data: ChargeDisbursedView[];
  header: string;
};

type ChartData = {
  period: string;
  'total disbursed': number;
};

const ChargeDisbrused = ({data, header}: Props) => {
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
      'total disbursed': getAmount(m),
    };
    return result;
  });

  return (
    <>
      <RoundedPanel className="p-4 text-center">
        <Row className="text-muted mb-2">
          <Col>{header}</Col>
        </Row>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: DEFAULTS.CHART_MARGIN,
              bottom: DEFAULTS.CHART_MARGIN,
              left: DEFAULTS.CHART_MARGIN,
              right: DEFAULTS.CHART_MARGIN,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total disbursed" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </RoundedPanel>
    </>
  );
};

export default ChargeDisbrused;
