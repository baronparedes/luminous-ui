import nock from 'nock';

import {fireEvent, waitFor} from '@testing-library/react';

import {getCurrentMonthYear} from '../../../../@utils/dates';
import {generateFakeProperty} from '../../../../@utils/fake-models';
import {renderWithRestful} from '../../../../@utils/test-renderers';
import BatchPropertiesToProcess from '../BatchPropertiesToProcess';

describe('BatchPropertiesToProcess', () => {
  const base = 'http://localhost';

  it('should start processing on render and notifies on completion', async () => {
    const currentPeriod = getCurrentMonthYear();
    const mockProperties = [
      {...generateFakeProperty(), code: 'P111'},
      {...generateFakeProperty(), code: 'P222'},
    ];

    nock(base)
      .post('/api/transaction/postMonthlyCharges', body => {
        expect(body).toEqual({
          propertyId: Number(mockProperties[0].id),
          year: currentPeriod.year,
          month: currentPeriod.month,
        });
        return true;
      })
      .reply(200);

    nock(base)
      .post('/api/transaction/postMonthlyCharges', body => {
        expect(body).toEqual({
          propertyId: Number(mockProperties[1].id),
          year: currentPeriod.year,
          month: currentPeriod.month,
        });
        return true;
      })
      .reply(200);

    const mockOnComplete = jest.fn();
    const {getByText, queryByText} = renderWithRestful(
      <BatchPropertiesToProcess
        properties={mockProperties}
        period={currentPeriod}
        onComplete={mockOnComplete}
      />,
      base
    );
    expect(getByText(/processed 0 out of 2 properties/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(getByText(/processed 1 out of 2 properties/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(getByText(/processed 2 out of 2 properties/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(queryByText(/^Unable to process/i)).not.toBeInTheDocument()
    );
    expect(mockOnComplete).toBeCalled();
  });

  it('should start processing on render and display errors when requests fails', async () => {
    const currentPeriod = getCurrentMonthYear();
    const mockProperties = [
      {...generateFakeProperty(), code: 'P111'},
      {...generateFakeProperty(), code: 'P222'},
    ];
    const {getByText} = renderWithRestful(
      <BatchPropertiesToProcess
        properties={mockProperties}
        period={currentPeriod}
      />,
      base
    );
    await waitFor(() =>
      expect(getByText(/processed 2 out of 2 properties/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        getByText(/Unable to process 2 out of 2 properties/i)
      ).toBeInTheDocument()
    );

    fireEvent.click(getByText(/show errors/i));
    await waitFor(() => expect(getByText(/P111/)).toBeInTheDocument());
    await waitFor(() => expect(getByText(/P222/)).toBeInTheDocument());
  });
});
