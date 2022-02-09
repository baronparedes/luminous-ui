import faker from 'faker';
import nock from 'nock';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {getCurrentMonthYear} from '../../../../@utils/dates';
import {
  generateFakePaymentHistory,
  generateFakeProperty,
  generateFakeTransaction,
} from '../../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {PropertyTransactionHistoryView} from '../../../../Api';
import PrintTransactionHistory from '../../actions/PrintTransactionHistory';
import ViewTransactionHistory from '../../actions/ViewTransactionHistory';

type PrintTransactionHistoryProps = React.ComponentProps<
  typeof PrintTransactionHistory
>;

jest.mock(
  '../../actions/PrintTransactionHistory',
  () => (props: PrintTransactionHistoryProps) => {
    return <div data-testid="mock-print-details">{props.property.code}</div>;
  }
);

describe('ViewTransactionHistory', () => {
  const base = 'http://localhost';
  const property = generateFakeProperty();
  const propertyId = Number(property.id);
  const {year} = getCurrentMonthYear();
  const previousYear = year - 1;
  const twoYearsAgo = year - 2;

  const data: PropertyTransactionHistoryView = {
    targetYear: year,
    previousBalance: faker.datatype.number(),
    transactionHistory: [
      generateFakeTransaction(),
      generateFakeTransaction(),
      generateFakeTransaction(),
      generateFakeTransaction(),
      generateFakeTransaction(),
    ],
    paymentHistory: [
      {...generateFakePaymentHistory(), transactionPeriod: `${year}-10-01`},
      {...generateFakePaymentHistory(), transactionPeriod: `${year}-11-01`},
      {...generateFakePaymentHistory(), transactionPeriod: `${year}-12-01`},
    ],
  };

  async function renderTarget() {
    nock(base)
      .get(`/api/property/getTransactionHistory/${propertyId}/${year}`)
      .reply(200, data);

    const target = renderWithProviderAndRestful(
      <ViewTransactionHistory buttonLabel="toggle" property={property} />,
      base
    );

    const button = target.getByText(/toggle/i);
    userEvent.click(button);

    const dialog = target.queryByRole('dialog');
    await waitFor(() => expect(dialog).toBeInTheDocument());
    await waitFor(() =>
      expect(target.queryByRole('progressbar')).not.toBeInTheDocument()
    );

    const selectYearInput = target.getByLabelText(
      /select year/i
    ) as HTMLSelectElement;
    expect(selectYearInput).toBeInTheDocument();

    await waitFor(() => {
      expect(selectYearInput.options.length).toEqual(3);
      expect(selectYearInput.value).toEqual(year.toString());
      expect(selectYearInput.options[0].value).toEqual(year.toString());
      expect(selectYearInput.options[1].value).toEqual(previousYear.toString());
      expect(selectYearInput.options[2].value).toEqual(twoYearsAgo.toString());
      expect(target.getByTestId('mock-print-details')).toBeInTheDocument();
    });

    return {
      ...target,
      selectYearInput,
    };
  }

  it('should fetch transaction history on load', async () => {
    const {getByText, queryByRole} = await renderTarget();
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );
    for (const expected of data.transactionHistory.filter(
      d => d.transactionType === 'charged'
    )) {
      expect(getByText(expected.charge?.code as string)).toBeInTheDocument();
    }
  });

  it('should fetch transaction history when selecting year', async () => {
    const {selectYearInput, getByText, queryByRole} = await renderTarget();
    const expectedTransaction = generateFakeTransaction();

    nock(base)
      .get(`/api/property/getTransactionHistory/${propertyId}/${previousYear}`)
      .reply(200, data);

    nock(base)
      .get(`/api/property/getTransactionHistory/${propertyId}/${twoYearsAgo}`)
      .reply(200, {
        ...data,
        targetYear: twoYearsAgo,
        transactionHistory: [expectedTransaction],
      });

    userEvent.selectOptions(selectYearInput, previousYear.toString());
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );

    userEvent.selectOptions(selectYearInput, twoYearsAgo.toString());
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        getByText(expectedTransaction.charge?.code as string)
      ).toBeInTheDocument()
    );
  });
});
