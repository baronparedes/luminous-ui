import nock from 'nock';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {ApprovedAny} from '../../../../@types';
import {generateFakeCharge} from '../../../../@utils/fake-models';
import {renderWithRestful} from '../../../../@utils/test-renderers';
import SettingCharges from '../SettingCharges';

describe('SettingCharges', () => {
  const base = 'http://localhost';
  it('should render and save charges', async () => {
    const mockedCharges = [generateFakeCharge(), generateFakeCharge()];

    window.confirm = jest.fn().mockImplementation(() => true);
    nock(base).get('/api/charge/getAllCharges').reply(200, mockedCharges);

    nock(base)
      .patch('/api/charge/patchCharges', mockedCharges as ApprovedAny)
      .reply(200);

    nock(base).get('/api/charge/getAllCharges').reply(200, mockedCharges);

    const {getByText} = renderWithRestful(<SettingCharges />, base);

    const saveButton = getByText(/save/i, {selector: 'button'});
    await waitFor(() => expect(saveButton).toBeDisabled());
    await waitFor(() => expect(saveButton).toBeEnabled());

    const expectedHeaders = [
      'id',
      'code',
      'posting type',
      'charge type',
      'rate',
    ];

    expect(getByText(/charges/i)).toBeInTheDocument();

    await waitFor(() => {
      for (const expectedHeader of expectedHeaders) {
        expect(getByText(expectedHeader, {selector: 'th'})).toBeInTheDocument();
      }
      for (const charge of mockedCharges) {
        const container = getByText(Number(charge.id))
          .parentElement as HTMLElement;
        const rateInput = within(container).getByPlaceholderText(
          /charge rate/i
        ) as HTMLInputElement;
        expect(within(container).getByText(charge.code)).toBeInTheDocument();
        expect(
          within(container).getByText(charge.postingType)
        ).toBeInTheDocument();
        expect(
          within(container).getByText(charge.chargeType)
        ).toBeInTheDocument();
        expect(rateInput).toBeInTheDocument();
        expect(rateInput.value).toEqual(charge.rate.toString());
      }
    });

    userEvent.click(saveButton);
    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => expect(saveButton).toBeDisabled());
    await waitFor(() => expect(saveButton).toBeEnabled());
  });
});
