import {Badge, Col, Row} from 'react-bootstrap';
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

import {roundOff} from '../../@utils/currencies';
import {toTransactionPeriodFromDate} from '../../@utils/dates';
import {sum} from '../../@utils/helpers';
import {CollectionEfficiencyView, Month, TransactionType} from '../../Api';
import {MONTHS} from '../../constants';
import RoundedPanel from '../@ui/RoundedPanel';
import {Spacer} from '../@ui/Spacer';

type Props = {
  data: CollectionEfficiencyView[];
};

type ChartData = {
  period: string;
  collected: number;
  charged: number;
};

const PeriodEfficiency = ({period, collected, charged}: ChartData) => {
  const percentage = roundOff((collected / charged) * 100);
  return (
    <div>
      <Badge pill variant="primary">
        {period}
      </Badge>
      <p>
        <strong>{percentage}%</strong>
      </p>
    </div>
  );
};

const CollectionEfficiency = ({data}: Props) => {
  const getAmount = (month: Month, type: TransactionType) => {
    return (
      data.find(
        d =>
          toTransactionPeriodFromDate(d.transactionPeriod).month === month &&
          d.transactionType === type
      )?.amount ?? 0
    );
  };

  const chartData = MONTHS.map(m => {
    const collected = getAmount(m, 'collected');
    const charged = getAmount(m, 'charged');
    const result: ChartData = {
      period: m,
      collected,
      charged,
    };
    return result;
  });

  const sumCollected = sum(chartData.map(c => c.collected));
  const sumCharged = sum(chartData.map(c => c.charged));
  const percentage = roundOff((sumCollected / sumCharged) * 100);

  return (
    <>
      <RoundedPanel className="p-3 text-center">
        <Row className="text-muted mb-3">
          <Col>Monthly Collection Efficiency</Col>
        </Row>
        <Row>
          {chartData.map((cd, i) => {
            return (
              <Col key={i}>
                <PeriodEfficiency {...cd} />
              </Col>
            );
          })}
        </Row>
      </RoundedPanel>
      <Spacer />
      <RoundedPanel className="p-4 text-center">
        <Row className="text-right text-muted mb-2">
          <Col>
            Yearly collection efficiency is at <strong>{percentage}%</strong>
          </Col>
        </Row>
        <ResponsiveContainer width="100%" height={300}>
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
            <Bar dataKey="charged" fill="#82ca9d" />
            <Bar dataKey="collected" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </RoundedPanel>
    </>
  );
};

export default CollectionEfficiency;