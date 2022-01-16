import faker from 'faker';
import nock from 'nock';
import * as reactToPrint from 'react-to-print';

import {fireEvent, waitFor} from '@testing-library/react';

import {getCurrentMonthYear} from '../../../../@utils/dates';
import {generateFakePropertyAccount} from '../../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {Month, Period} from '../../../../Api';
import ViewPreviousStatements from '../../actions/ViewPreviousStatements';

describe.skip('ViewPreviousStatements', () => {
  const base = 'http://localhost';

  async function renderTarget() {
    const propertyId = faker.datatype.number();
    const currentPeriod = getCurrentMonthYear();

    const availableYears: Period[] = [
      {year: currentPeriod.year, month: currentPeriod.month},
      {year: 2021, month: 'AUG'},
      {year: 2021, month: 'JUL'},
      {year: 2020, month: 'DEC'},
      {year: 2019, month: 'DEC'},
      {year: 2019, month: 'NOV'},
    ];

    nock(base)
      .get(`/api/transaction/getAvailablePeriods/${propertyId}`)
      .reply(200, availableYears);

    const target = renderWithProviderAndRestful(
      <ViewPreviousStatements
        buttonLabel="view previous statements"
        propertyId={propertyId}
      />,
      base
    );

    const button = target.getByText(/view previous statements/i);
    fireEvent.click(button);

    const dialog = target.queryByRole('dialog');
    await waitFor(() => expect(dialog).toBeInTheDocument());
    await waitFor(() =>
      expect(target.queryByRole('progressbar')).not.toBeInTheDocument()
    );

    const selectedYear = target.getByLabelText(
      /select year/i
    ) as HTMLSelectElement;
    expect(selectedYear).toBeInTheDocument();

    await waitFor(() => {
      expect(selectedYear.options.length).toEqual(3);
      expect(selectedYear.value).toEqual('2021');
      expect(selectedYear.options[0].value).toEqual('2021');
      expect(selectedYear.options[1].value).toEqual('2020');
      expect(selectedYear.options[2].value).toEqual('2019');
    });

    return {
      ...target,
      propertyId,
      selectedYear,
      availableYears,
      currentPeriod,
    };
  }

  function setupEndpoint(propertyId: number, year: number, month: Month) {
    const propertyAccount = generateFakePropertyAccount();
    nock(base)
      .get(
        `/api/property-account/getPropertyAccount/${propertyId}?month=${month}&year=${year}`
      )
      .reply(200, propertyAccount);
  }

  beforeAll(() => {
    const targetMonth = 9 - 1; // This is September, since JS Date month are zero indexed;
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, targetMonth));
  });

  it('should render and toggle periods by year', async () => {
    const {queryByText, getByText, selectedYear, currentPeriod} =
      await renderTarget();

    expect(
      queryByText(`${currentPeriod.year} ${currentPeriod.month}`)
    ).not.toBeInTheDocument();
    expect(getByText(/2021 AUG/)).toBeInTheDocument();
    expect(getByText(/2021 JUL/)).toBeInTheDocument();

    fireEvent.change(selectedYear, {
      target: {value: '2020'},
    });
    expect(getByText(/2020 DEC/)).toBeInTheDocument();

    fireEvent.change(selectedYear, {
      target: {value: '2019'},
    });
    expect(getByText(/2019 DEC/)).toBeInTheDocument();
    expect(getByText(/2019 NOV/)).toBeInTheDocument();
  });

  it('should print statement of account', async () => {
    const handlePrintFn = jest.fn();
    const mocked = jest.spyOn(reactToPrint, 'useReactToPrint');
    mocked.mockImplementation(() => handlePrintFn);

    const {getByText, propertyId} = await renderTarget();

    const statement1 = getByText(/2021 AUG/);
    const statement2 = getByText(/2021 JUL/);

    setupEndpoint(propertyId, 2021, 'AUG');

    fireEvent.click(statement1);
    await waitFor(() => expect(handlePrintFn).toBeCalledTimes(1));

    fireEvent.click(statement1);
    expect(handlePrintFn).toBeCalledTimes(2); // second click uses cached data

    setupEndpoint(propertyId, 2021, 'JUL');

    fireEvent.click(statement2);
    await waitFor(() => expect(handlePrintFn).toBeCalledTimes(3));

    fireEvent.click(statement2);
    expect(handlePrintFn).toBeCalledTimes(4); // second click uses cached data
  });
});
