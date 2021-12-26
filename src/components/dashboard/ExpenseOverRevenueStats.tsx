import {Col, Container, Row} from 'react-bootstrap';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import {ApprovedAny} from '../../@types';
import {filterByMonth} from '../../@utils/dates';
import {sum} from '../../@utils/helpers';
import {
  CategorizedExpenseView,
  ChargeAttr,
  CollectionEfficiencyView,
  Month,
} from '../../Api';
import {Currency} from '../@ui/Currency';
import {Spacer} from '../@ui/Spacer';

type Props = {
  collectionEfficieny: CollectionEfficiencyView[];
  categorizedExpense: CategorizedExpenseView[];
  charges: ChargeAttr[] | null;
  selectedMonth: Month;
};

type ExpenseOverRevenueBarChartProps = {
  data?: ApprovedAny[];
  dataKey1: string;
  dataKey2: string;
};

type ChartData = {
  period: Month;
  [key: string]: ApprovedAny;
};

const ExpenseOverRevenueBarChart = ({
  data,
  dataKey1,
  dataKey2,
}: ExpenseOverRevenueBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          bottom: 5,
          left: 5,
          right: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey1} fill="#82ca9d" />
        <Bar dataKey={dataKey2} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const CollectionStats = ({
  collectionEfficieny,
  selectedMonth,
}: Omit<Props, 'charges' | 'categorizedExpense'>) => {
  const filteredByMonth =
    collectionEfficieny.filter(d =>
      filterByMonth(d.transactionPeriod, selectedMonth)
    ) ?? [];
  const charged = sum(
    filteredByMonth
      .filter(d => d.transactionType === 'charged')
      .map(d => d.amount)
  );
  const collected = sum(
    filteredByMonth
      .filter(d => d.transactionType === 'collected')
      .map(d => d.amount)
  );
  const summary: ChartData = {
    period: selectedMonth,
    charged: charged,
    collected: collected,
  };

  return (
    <Container>
      <text className="text-muted">Collection Deficit</text>
      <div>
        <strong>
          <Currency noCurrencyColor currency={charged - collected} />
        </strong>
      </div>
      <Spacer />
      <ExpenseOverRevenueBarChart
        data={[summary]}
        dataKey1="charged"
        dataKey2="collected"
      />
    </Container>
  );
};

const ExcessRevenueStats = ({
  collectionEfficieny,
  categorizedExpense,
  selectedMonth,
  charges,
}: Props) => {
  const targetCharges = charges?.filter(c => !c.passOn).map(c => c.code) ?? [];
  const revenue = sum(
    collectionEfficieny
      .filter(
        d =>
          filterByMonth(d.transactionPeriod, selectedMonth) &&
          d.transactionType === 'collected' &&
          targetCharges.includes(d.chargeCode)
      )
      .map(d => d.amount)
  );
  const expense = sum(
    categorizedExpense
      .filter(
        d => filterByMonth(d.transactionPeriod, selectedMonth) && !d.passOn
      )
      .map(d => d.totalCost)
  );
  const summary: ChartData = {
    period: selectedMonth,
    revenue,
    expense,
  };

  return (
    <Container>
      <text className="text-muted">Excess Revenue</text>
      <div>
        <strong>
          <Currency noCurrencyColor currency={revenue - expense} />
        </strong>
      </div>
      <Spacer />
      <ExpenseOverRevenueBarChart
        data={[summary]}
        dataKey1="revenue"
        dataKey2="expense"
      />
    </Container>
  );
};

const ExcessPassOnStats = ({
  collectionEfficieny,
  categorizedExpense,
  selectedMonth,
  charges,
}: Props) => {
  const targetCharges = charges?.filter(c => c.passOn).map(c => c.code) ?? [];
  const collected = sum(
    collectionEfficieny
      .filter(
        d =>
          filterByMonth(d.transactionPeriod, selectedMonth) &&
          d.transactionType === 'collected' &&
          targetCharges.includes(d.chargeCode)
      )
      .map(d => d.amount)
  );
  const released = sum(
    categorizedExpense
      .filter(
        d => filterByMonth(d.transactionPeriod, selectedMonth) && d.passOn
      )
      .map(d => d.totalCost)
  );
  const summary: ChartData = {
    period: selectedMonth,
    collected,
    released,
  };

  return (
    <Container>
      <text className="text-muted">Unreleased Pass-On Funds</text>
      <div>
        <strong>
          <Currency noCurrencyColor currency={collected - released} />
        </strong>
      </div>
      <Spacer />
      <ExpenseOverRevenueBarChart
        data={[summary]}
        dataKey1="collected"
        dataKey2="released"
      />
    </Container>
  );
};

const ExpenseOverRevenueStats = ({
  collectionEfficieny,
  categorizedExpense,
  selectedMonth,
  charges,
}: Props) => {
  return (
    <>
      <Container>
        <Row>
          <Col md={4}>
            <CollectionStats
              collectionEfficieny={collectionEfficieny}
              selectedMonth={selectedMonth}
            />
          </Col>
          <Col md={4}>
            <ExcessRevenueStats
              collectionEfficieny={collectionEfficieny}
              categorizedExpense={categorizedExpense}
              selectedMonth={selectedMonth}
              charges={charges}
            />
          </Col>
          <Col md={4}>
            <ExcessPassOnStats
              collectionEfficieny={collectionEfficieny}
              categorizedExpense={categorizedExpense}
              selectedMonth={selectedMonth}
              charges={charges}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ExpenseOverRevenueStats;
