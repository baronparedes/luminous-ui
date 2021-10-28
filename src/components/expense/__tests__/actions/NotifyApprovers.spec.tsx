import faker from 'faker';
import nock from 'nock';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {renderWithRestful} from '../../../../@utils/test-renderers';
import NotifyApprovers from '../../actions/NotifyApprovers';

describe('NotifyApprovers', () => {
  const base = 'http://localhost';

  it('should notify approvers once', async () => {
    const purchaseOrderId = faker.datatype.number();
    const {getByText} = renderWithRestful(
      <NotifyApprovers
        purchaseOrderId={purchaseOrderId}
        buttonLabel="notify"
      />,
      base
    );

    nock(base)
      .post(`/api/purchase-order/notifyApprovers/${purchaseOrderId}`)
      .reply(200);

    const input = getByText(/notify/i);

    expect(input).toBeEnabled();

    userEvent.click(input);
    await waitFor(() => expect(input).toBeDisabled());
  });
});
