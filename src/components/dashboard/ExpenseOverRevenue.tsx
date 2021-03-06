import React, {useState} from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';
import {useReactToPrint} from 'react-to-print';

import {ApprovedAny} from '../../@types';
import {roundOff} from '../../@utils/currencies';
import {
  filterByMonth,
  filterOnOrBeforeByMonth,
  getCurrentMonthYear,
  toMonthValue,
  toTransactionPeriodFromDate,
} from '../../@utils/dates';
import {sum} from '../../@utils/helpers';
import {
  CategorizedExpenseView,
  ChargeAttr,
  CollectionEfficiencyView,
  Month,
  TransactionType,
  useGetCollectionBreakdown,
} from '../../Api';
import {VERBIAGE} from '../../constants';
import {PageBreak, PageHeader, PrintPaper} from '../@print-papers/PaperPdf';
import {Currency} from '../@ui/Currency';
import RoundedPanel from '../@ui/RoundedPanel';
import SelectMonth from '../@ui/SelectMonth';
import {Spacer} from '../@ui/Spacer';
import {Table} from '../@ui/Table';
import ExpenseOverRevenueStats from './ExpenseOverRevenueStats';
import PropertyCollectionByCharge from './PropertyCollectionByCharge';

type Props = {
  collectionEfficieny: CollectionEfficiencyView[];
  categorizedExpense: CategorizedExpenseView[];
  charges: ChargeAttr[] | null;
  selectedYear: number;
};

type ReportData = {
  label: string | React.ReactNode;
  total: number;
  runningAverage: number;
  runningTotal: number;
  averageDifference: number;
};

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
    label: 'TOTAL',
    total: summaryTotal,
    runningAverage: summaryRunningAverage,
    runningTotal: summaryRunningTotal,
    averageDifference: summaryAverageDifference,
  } as ReportData;
}

function toRevenueData(
  data: CollectionEfficiencyView[],
  selectedMonth: Month,
  charges: ChargeAttr[] | null
) {
  const revenueData: ReportData[] = [];
  const revenueEfficiency = calculateEfficiencyByMonth(data, selectedMonth);

  if (charges) {
    charges.forEach(charge => {
      const filteredByMonth = data.filter(
        d =>
          d.chargeCode === charge.code &&
          d.transactionType === 'collected' &&
          filterByMonth(d.transactionPeriod, selectedMonth)
      );
      const filteredOnOrBefore = data.filter(
        d =>
          d.chargeCode === charge.code &&
          d.transactionType === 'collected' &&
          filterOnOrBeforeByMonth(d.transactionPeriod, selectedMonth)
      );
      const total = sum(filteredByMonth.map(d => d.amount));
      const runningTotal = sum(filteredOnOrBefore.map(d => d.amount));
      const runningAverage = runningTotal / toMonthValue(selectedMonth);
      const averageDifference = total - runningAverage;
      revenueData.push({
        label: charge.code,
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

function formatExpenseData(
  data: CategorizedExpenseView[],
  selectedMonth: Month,
  parentCategory: string
) {
  const generateReportDataByCategory = (
    category: string,
    indented?: boolean
  ) => {
    const filteredByMonth = data.filter(
      d =>
        d.category === category &&
        filterByMonth(d.transactionPeriod, selectedMonth)
    );
    const filteredOnOrBefore = data.filter(
      d =>
        d.category === category &&
        filterOnOrBeforeByMonth(d.transactionPeriod, selectedMonth)
    );
    const total = sum(filteredByMonth.map(d => d.totalCost));
    const runningTotal = sum(filteredOnOrBefore.map(d => d.totalCost));
    const runningAverage = runningTotal / toMonthValue(selectedMonth);
    const averageDifference = total - runningAverage;
    const item: ReportData = {
      label: indented ? <text className="pl-5">{category}</text> : category,
      total,
      runningAverage,
      runningTotal,
      averageDifference,
    };
    return item;
  };

  const result: ReportData[] = [generateReportDataByCategory(parentCategory)];
  const uniqueSubCategories = [
    ...new Set(
      data.filter(d => d.category !== parentCategory).map(d => d.category)
    ),
  ];
  uniqueSubCategories.forEach(subCategory => {
    result.push(generateReportDataByCategory(subCategory, true));
  });

  return result;
}

function toExpenseData(data: CategorizedExpenseView[], selectedMonth: Month) {
  const targetData = data.filter(d => !d.passOn);
  const expenseData: ReportData[] = [];
  const uniqueParentCategories = [
    ...new Set(targetData.map(d => d.parentCategory)),
  ];
  uniqueParentCategories.forEach(parentCategory => {
    const categorizedData = targetData.filter(
      d => d.parentCategory === parentCategory
    );
    expenseData.push(
      ...formatExpenseData(categorizedData, selectedMonth, parentCategory)
    );
  });

  return {
    expenseData,
  };
}

function toExpensePassOnData(
  data: CategorizedExpenseView[],
  selectedMonth: Month,
  charges: ChargeAttr[] | null
) {
  const expensePassOnData: ReportData[] = [];
  if (charges) {
    charges
      .filter(c => c.passOn === true)
      .forEach(charge => {
        const filteredByMonth = data.filter(
          d =>
            d.chargeCode === charge.code &&
            filterByMonth(d.transactionPeriod, selectedMonth)
        );
        const filteredOnOrBefore = data.filter(
          d =>
            d.chargeCode === charge.code &&
            filterOnOrBeforeByMonth(d.transactionPeriod, selectedMonth)
        );
        const total = sum(filteredByMonth.map(d => d.totalCost));
        const runningTotal = sum(filteredOnOrBefore.map(d => d.totalCost));
        const runningAverage = runningTotal / toMonthValue(selectedMonth);
        const averageDifference = total - runningAverage;
        expensePassOnData.push({
          label: charge.code,
          total,
          runningAverage,
          runningTotal,
          averageDifference,
        });
      });
  }

  return {
    expensePassOnData,
  };
}

const ReportTable = ({
  data,
  selectedMonth,
  renderHeaderContent,
  noZero,
}: {
  data: ReportData[];
  selectedMonth: Month;
  renderHeaderContent?: React.ReactNode;
  noZero?: boolean;
}) => {
  const totals = toTotals(data, selectedMonth);
  return (
    <Table
      className="table-sm"
      renderHeaderContent={renderHeaderContent}
      headers={['', 'total', 'running total', 'running average', 'difference']}
    >
      <tbody>
        {data.map((item, i) => {
          return (
            <tr key={i}>
              <td width={300}>{item.label}</td>
              <td>
                <strong>
                  <Currency
                    noCurrencyColor
                    noZero={noZero}
                    currency={item.total}
                  />
                </strong>
              </td>
              <td>
                <strong>
                  <Currency
                    noCurrencyColor
                    noZero={noZero}
                    currency={item.runningTotal}
                  />
                </strong>
              </td>
              <td>
                <strong>
                  <Currency
                    noCurrencyColor
                    noZero={noZero}
                    currency={item.runningAverage}
                  />
                </strong>
              </td>
              <td>
                <strong>
                  <Currency noZero={noZero} currency={item.averageDifference} />
                </strong>
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td className="pt-3">
            <h5>{totals.label}</h5>
          </td>
          <td className="pt-3">
            <h5>
              <Currency
                noCurrencyColor
                noZero={noZero}
                currency={totals.total}
              />
            </h5>
          </td>
          <td className="pt-3">
            <h5>
              <Currency
                noCurrencyColor
                noZero={noZero}
                currency={totals.runningTotal}
              />
            </h5>
          </td>
          <td className="pt-3">
            <h5>
              <Currency
                noCurrencyColor
                noZero={noZero}
                currency={totals.runningAverage}
              />
            </h5>
          </td>
          <td className="pt-3">
            <h5>
              <Currency noZero={noZero} currency={totals.averageDifference} />
            </h5>
          </td>
        </tr>
      </tfoot>
    </Table>
  );
};

const ExpenseOverRevenue = ({
  collectionEfficieny,
  categorizedExpense,
  charges,
  selectedYear,
}: Props) => {
  const {month} = getCurrentMonthYear();
  const [selectedMonth, setSelectedMonth] = useState<Month>(month);
  const {revenueData, revenueEfficiency} = toRevenueData(
    collectionEfficieny,
    selectedMonth,
    charges
  );
  const {expenseData} = toExpenseData(categorizedExpense, selectedMonth);
  const {expensePassOnData} = toExpensePassOnData(
    categorizedExpense,
    selectedMonth,
    charges
  );

  const printPaperRef = React.createRef<ApprovedAny>();
  const documentTitle = VERBIAGE.FILE_NAMES.EXPENSE_OVER_REVENUE(
    selectedYear,
    selectedMonth
  );
  const handlePrint = useReactToPrint({
    bodyClass: 'print-body',
    content: () => printPaperRef.current,
    documentTitle,
  });

  const {data: propertyCollectionByChargeData, loading} =
    useGetCollectionBreakdown({year: selectedYear, month: selectedMonth});

  return (
    <>
      <RoundedPanel className="p-3">
        <Container className="p-0 m-0">
          <Row>
            <Col md={10}>
              <SelectMonth
                value={selectedMonth}
                onSelectMonth={setSelectedMonth}
                size="lg"
              />
            </Col>
            <Col>
              <Button
                className={'w-100'}
                onClick={() => {
                  handlePrint && handlePrint();
                }}
              >
                <FaPrint />
              </Button>
            </Col>
          </Row>
        </Container>
        <PrintPaper ref={printPaperRef}>
          <Spacer />
          <PageHeader title={documentTitle} />
          <Container>
            <Spacer />
            <ExpenseOverRevenueStats
              collectionEfficieny={collectionEfficieny}
              categorizedExpense={categorizedExpense}
              charges={charges}
              selectedMonth={selectedMonth}
            />
          </Container>
          <PageBreak />
          <Container>
            <Spacer />
            <ReportTable
              data={revenueData}
              selectedMonth={selectedMonth}
              renderHeaderContent={
                <>
                  <Row>
                    <Col sm={12} md={8}>
                      <div>
                        <h6>
                          Revenue for the month of {selectedMonth}
                          {!loading &&
                            propertyCollectionByChargeData &&
                            propertyCollectionByChargeData.length > 0 && (
                              <PropertyCollectionByCharge
                                data={propertyCollectionByChargeData}
                                selectedMonth={selectedMonth}
                                selectedYear={selectedYear}
                              />
                            )}
                        </h6>
                      </div>
                    </Col>
                    {Number(revenueEfficiency) > 0 && (
                      <Col>
                        <div className="text-md-right">
                          <small>
                            Collection Efficiency of {revenueEfficiency}%
                          </small>
                        </div>
                      </Col>
                    )}
                  </Row>
                </>
              }
            />
          </Container>
          <PageBreak />
          <Container>
            <Spacer />
            <ReportTable
              noZero
              data={expenseData}
              selectedMonth={selectedMonth}
              renderHeaderContent={
                <>
                  <Row>
                    <Col>
                      <div>
                        <h6>
                          Approved Expenses for the month of {selectedMonth}
                        </h6>
                      </div>
                    </Col>
                  </Row>
                </>
              }
            />
          </Container>
          <PageBreak />
          <Container>
            <Spacer />
            <ReportTable
              data={expensePassOnData}
              selectedMonth={selectedMonth}
              renderHeaderContent={
                <>
                  <Row>
                    <Col>
                      <div>
                        <h6>
                          Approved Pass-On Expenses for the month of{' '}
                          {selectedMonth}
                        </h6>
                      </div>
                    </Col>
                  </Row>
                </>
              }
            />
          </Container>
        </PrintPaper>
      </RoundedPanel>
    </>
  );
};

export default ExpenseOverRevenue;
