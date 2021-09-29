import nock from 'nock';

import {fireEvent, waitFor} from '@testing-library/react';

import {getCurrentMonthYear} from '../../../../@utils/dates';
import {generateFakeProperty} from '../../../../@utils/fake-models';
import {renderWithProviderAndRouterAndRestful} from '../../../../@utils/test-renderers';
import BatchPropertiesToProcess from '../BatchPropertiesToProcess';
import BatchTransactionView from '../BatchTransactionView';

type BatchPropertiesToProcessProps = React.ComponentProps<
  typeof BatchPropertiesToProcess
>;

jest.mock(
  '../BatchPropertiesToProcess',
  () =>
    ({period, properties}: BatchPropertiesToProcessProps) => {
      return (
        <>
          <div data-testid="mock-period-to-process">
            {JSON.stringify(period)}
          </div>
          <div data-testid="mock-properties-to-process">
            {JSON.stringify(properties)}
          </div>
        </>
      );
    }
);

describe('BatchTranasctionView', () => {
  const base = 'http://localhost';

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should render', async () => {
    const currentPeriod = getCurrentMonthYear();
    const mockProperties = [generateFakeProperty(), generateFakeProperty()];
    window.confirm = jest.fn().mockImplementation(() => true);
    nock(base).get('/api/property/getAll').reply(200, mockProperties);

    const {getByText, getByTestId} = renderWithProviderAndRouterAndRestful(
      <BatchTransactionView />,
      base
    );
    fireEvent.click(getByText(/process/i, {selector: 'button'}));

    await waitFor(() => {
      expect(getByTestId('mock-period-to-process')).toBeInTheDocument();
      expect(getByTestId('mock-properties-to-process')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByTestId('mock-properties-to-process').textContent).toEqual(
        JSON.stringify(mockProperties)
      );
      expect(getByTestId('mock-period-to-process').textContent).toEqual(
        JSON.stringify(currentPeriod)
      );
    });

    expect(window.confirm).toHaveBeenCalled();
  });
});
