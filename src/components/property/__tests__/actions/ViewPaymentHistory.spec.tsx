import faker from 'faker';
import nock from 'nock';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {getCurrentMonthYear} from '../../../../@utils/dates';
import {generateFakePaymentHistory} from '../../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {PaymentHistoryView} from '../../../../Api';
import ViewPaymentHistory from '../../actions/ViewPaymentHistory';

describe('ViewPaymentHistory', () => {
  const base = 'http://localhost';
  const propertyId = faker.datatype.number();
  const {year} = getCurrentMonthYear();
  const previousYear = year - 1;
  const twoYearsAgo = year - 2;

  const paymentHistoryData: PaymentHistoryView[] = [
    {...generateFakePaymentHistory(), transactionPeriod: `${year}-10-01`},
    {...generateFakePaymentHistory(), transactionPeriod: `${year}-11-01`},
    {...generateFakePaymentHistory(), transactionPeriod: `${year}-12-01`},
  ];

  async function renderTarget() {
    nock(base)
      .get(`/api/property/getPaymentHistory/${propertyId}/${year}`)
      .reply(200, paymentHistoryData);

    const target = renderWithProviderAndRestful(
      <ViewPaymentHistory buttonLabel="toggle" propertyId={propertyId} />,
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
    });

    return {
      ...target,
      selectYearInput,
    };
  }

  it('should fetch payment history on load', async () => {
    const {getByText} = await renderTarget();
    expect(getByText('OCT')).toBeInTheDocument();
    expect(getByText('NOV')).toBeInTheDocument();
    expect(getByText('DEC')).toBeInTheDocument();
  });

  it('should fetch payment history when selecting year', async () => {
    const {selectYearInput, getByText, queryByRole} = await renderTarget();

    nock(base)
      .get(`/api/property/getPaymentHistory/${propertyId}/${previousYear}`)
      .reply(200, []);

    nock(base)
      .get(`/api/property/getPaymentHistory/${propertyId}/${twoYearsAgo}`)
      .reply(200, [
        {
          ...generateFakePaymentHistory(),
          transactionPeriod: `${twoYearsAgo}-01-01`,
        },
      ]);

    userEvent.selectOptions(selectYearInput, previousYear.toString());
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(getByText(/No items to display/i)).toBeInTheDocument()
    );

    userEvent.selectOptions(selectYearInput, twoYearsAgo.toString());
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );
    await waitFor(() => expect(getByText('JAN')).toBeInTheDocument());
  });
});
