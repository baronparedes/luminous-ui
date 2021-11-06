import nock from 'nock';
import * as reactToPrint from 'react-to-print';

import {fireEvent, waitFor} from '@testing-library/react';

import {getCurrentMonthYear} from '../../../../@utils/dates';
import {generateFakePropertyAccount} from '../../../../@utils/fake-models';
import {renderWithProviderAndRouterAndRestful} from '../../../../@utils/test-renderers';
import SOA from '../../../@print-papers/SOA';
import BatchPrintView from '../BatchPrintView';

type SOAProps = React.ComponentProps<typeof SOA>;

jest.mock('../../../@print-papers/SOA', () => (props: SOAProps) => {
  return (
    <>
      <div data-testid={`mock-period-soa-${props.propertyAccount?.propertyId}`}>
        {JSON.stringify(props)}
      </div>
    </>
  );
});

describe('BatchPrintView', () => {
  const base = 'http://localhost';

  it('should render', async () => {
    const currentPeriod = getCurrentMonthYear();
    const mockPropertyAccounts = [
      generateFakePropertyAccount(),
      generateFakePropertyAccount(),
    ];
    window.confirm = jest.fn().mockImplementation(() => true);
    nock(base)
      .get(
        `/api/property-account/getPropertyAccountsByPeriod?year=${currentPeriod.year}&month=${currentPeriod.month}`
      )
      .reply(200, mockPropertyAccounts);

    const handlePrintFn = jest.fn();
    const mocked = jest.spyOn(reactToPrint, 'useReactToPrint');
    mocked.mockImplementation(() => handlePrintFn);

    const {getByText, getByTestId} = renderWithProviderAndRouterAndRestful(
      <BatchPrintView />,
      base
    );
    fireEvent.click(getByText(/render/i, {selector: 'button'}));

    for (const item of mockPropertyAccounts) {
      await waitFor(() => {
        expect(
          getByTestId(`mock-period-soa-${item.propertyId}`)
        ).toBeInTheDocument();
      });
    }

    await waitFor(() =>
      expect(
        getByText(/rendered 2 properties for printing/i)
      ).toBeInTheDocument()
    );

    fireEvent.click(getByText(/reprint/i));
    await waitFor(() => expect(handlePrintFn).toBeCalledTimes(2));
    expect(window.confirm).toBeCalled();
  });
});
