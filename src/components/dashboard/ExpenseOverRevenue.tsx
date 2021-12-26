import {useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';

import {roundOff} from '../../@utils/currencies';
import {
  getCurrentMonthYear,
  toMonthValue,
  toTransactionPeriodFromDate,
} from '../../@utils/dates';
import {sum} from '../../@utils/helpers';
import {
  ChargeAttr,
  CollectionEfficiencyView,
  Month,
  TransactionType,
} from '../../Api';
import {Currency} from '../@ui/Currency';
import RoundedPanel from '../@ui/RoundedPanel';
import SelectMonth from '../@ui/SelectMonth';
import {Spacer} from '../@ui/Spacer';
import {Table} from '../@ui/Table';

type Props = {
  collectionEfficieny: CollectionEfficiencyView[];
  charges: ChargeAttr[] | null;
};

type ReportData = {
  description: string;
  total: number;
  runningAverage: number;
  runningTotal: number;
  averageDifference: number;
};

function filterByMonth(data: CollectionEfficiencyView[], month: Month) {
  return data.filter(
    d =>
      toTransactionPeriodFromDate(d.transactionPeriod).month === month &&
      d.transactionType === 'collected'
  );
}

function filterOnOrBeforeByMonth(
  data: CollectionEfficiencyView[],
  month: Month
) {
  return data.filter(
    d =>
      toMonthValue(toTransactionPeriodFromDate(d.transactionPeriod).month) <=
        toMonthValue(month) && d.transactionType === 'collected'
  );
}

function calculateEfficiencyByMonth(
  data: CollectionEfficiencyView[],
  selectedMonth: Month
): number {
  const sumByTransactionType = (type: TransactionType) => {
    return sum(
      data
        .filter(
          d =>
            toTransactionPeriodFromDate(d.transactionPeriod).month ===
              selectedMonth && d.transactionType === type
        )
        .map(d => d.amount)
    );
  };
  const collected = sumByTransactionType('collected');
  const charged = sumByTransactionType('charged');
  return roundOff((collected / charged) * 100);
}

function toTotals(data: ReportData[], selectedMonth: Month) {
  const summaryTotal = sum(data.map(d => d.total));
  const summaryRunningTotal = sum(data.map(d => d.total));
  const summaryRunningAverage =
    summaryRunningTotal / toMonthValue(selectedMonth);
  const summaryAverageDifference = summaryTotal - summaryRunningAverage;
  return {
    description: 'TOTAL',
    total: summaryTotal,
    runningAverage: summaryRunningAverage,
    runningTotal: summaryRunningTotal,
    averageDifference: summaryAverageDifference,
  } as ReportData;
}

function toRevenueData(
  data: CollectionEfficiencyView[],
  charges: ChargeAttr[] | null,
  selectedMonth: Month
) {
  const revenueData: ReportData[] = [];
  const revenueEfficiency = calculateEfficiencyByMonth(data, selectedMonth);
  if (charges) {
    charges.forEach(charge => {
      const filtered = filterByMonth(data, selectedMonth).filter(
        d => d.chargeCode === charge.code
      );
      const filteredOnOrBefore = filterOnOrBeforeByMonth(
        data,
        selectedMonth
      ).filter(d => d.chargeCode === charge.code);
      const total = sum(filtered.map(d => d.amount));
      const runningTotal = sum(filteredOnOrBefore.map(d => d.amount));
      const runningAverage = runningTotal / toMonthValue(selectedMonth);
      const averageDifference = total - runningAverage;
      revenueData.push({
        description: charge.code,
        total,
        runningAverage,
        runningTotal,
        averageDifference,
      });
    });
  }

  return {
    revenueData,
    revenueEfficiency,
  };
}

const ReportTable = ({
  data,
  selectedMonth,
  efficiency,
}: {
  data: ReportData[];
  efficiency?: number;
  selectedMonth: Month;
}) => {
  const totals = toTotals(data, selectedMonth);
  return (
    <Table
      className="table-sm"
      renderHeaderContent={
        <>
          <Row>
            <Col sm={12} md={8}>
              <div>
                <h6>Revenue for the month of {selectedMonth}</h6>
              </div>
            </Col>
            {Number(efficiency) > 0 && (
              <Col>
                <div className="text-md-right">
                  <small>Collection Efficiency of {efficiency}%</small>
                </div>
              </Col>
            )}
          </Row>
        </>
      }
      headers={['', 'total', 'running total', 'running average', 'difference']}
    >
      <tbody>
        {data.map((item, i) => {
          return (
            <tr key={i}>
              <td>{item.description}</td>
              <td>
                <strong>
                  <Currency noCurrencyColor currency={item.total} />
                </strong>
              </td>
              <td>
                <strong>
                  <Currency noCurrencyColor currency={item.runningTotal} />
                </strong>
              </td>
              <td>
                <strong>
                  <Currency noCurrencyColor currency={item.runningAverage} />
                </strong>
              </td>
              <td>
                <strong>
                  <Currency currency={item.averageDifference} />
                </strong>
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td className="pt-3">
            <h5>{totals.description}</h5>
          </td>
          <td className="pt-3">
            <h5>
              <Currency noCurrencyColor currency={totals.total} />
            </h5>
          </td>
          <td className="pt-3">
            <h5>
              <Currency noCurrencyColor currency={totals.runningTotal} />
            </h5>
          </td>
          <td className="pt-3">
            <h5>
              <Currency noCurrencyColor currency={totals.runningAverage} />
            </h5>
          </td>
          <td className="pt-3">
            <h5>
              <Currency currency={totals.averageDifference} />
            </h5>
          </td>
        </tr>
      </tfoot>
    </Table>
  );
};

const ExpenseOverRevenue = ({collectionEfficieny, charges}: Props) => {
  const {month} = getCurrentMonthYear();
  const [selectedMonth, setSelectedMonth] = useState<Month>(month);
  const {revenueData, revenueEfficiency} = toRevenueData(
    collectionEfficieny,
    charges,
    selectedMonth
  );
  return (
    <>
      <RoundedPanel className="p-3">
        <SelectMonth
          value={selectedMonth}
          onSelectMonth={setSelectedMonth}
          size="lg"
        />
        <Spacer />
        <Container>
          <ReportTable
            data={revenueData}
            efficiency={revenueEfficiency}
            selectedMonth={selectedMonth}
          />
        </Container>
      </RoundedPanel>
    </>
  );
};

export default ExpenseOverRevenue;
