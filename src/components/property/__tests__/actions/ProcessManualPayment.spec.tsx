import faker from 'faker';
import nock from 'nock';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeCharge,
  generateFakeTransaction,
} from '../../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {TransactionAttr} from '../../../../Api';
import ProcessManualPayment from '../../actions/ProcessManualPayment';

describe('ProcessManualPayment', () => {
  const base = 'http://localhost';

  it('should render', async () => {
    renderWithProviderAndRestful(
      <ProcessManualPayment propertyId={1} buttonLabel="process payment" />,
      base
    );
  });

  it('should add manual payments and collect payment', async () => {
    const propertyId = faker.datatype.number();
    const charges = [generateFakeCharge(), generateFakeCharge()];
    const [charge1, charge2] = charges;
    const mockTransactions: TransactionAttr[] = [
      {
        ...generateFakeTransaction(),
        propertyId,
        chargeId: Number(charge1.id),
        charge: charge1,
      },
      {
        ...generateFakeTransaction(),
        propertyId,
        chargeId: Number(charge2.id),
        charge: charge2,
      },
    ];
    const orNumber = faker.random.alphaNumeric();

    window.confirm = jest.fn().mockImplementation(() => true);

    nock(base).post('/api/transaction/postCollections').reply(204);

    const {
      getByText,
      getByRole,
      getByTitle,
      getByPlaceholderText,
      queryByRole,
      queryByText,
    } = renderWithProviderAndRestful(
      <ProcessManualPayment
        propertyId={propertyId}
        charges={charges}
        buttonLabel="toggle"
      />,
      base
    );

    const toggleModalButton = getByText(/toggle/i, {
      selector: 'button',
    });
    userEvent.click(toggleModalButton);
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

    const addButton = getByTitle(/new transaction/i);
    expect(addButton).toBeInTheDocument();

    for (const t of mockTransactions) {
      userEvent.click(addButton);
      await waitFor(() =>
        expect(getByText(/add payments/i)).toBeInTheDocument()
      );

      userEvent.type(
        getByPlaceholderText(/enter amount/i),
        t.amount.toString()
      );
      userEvent.selectOptions(
        getByPlaceholderText(/please select a charge code/i),
        Number(t.chargeId).toString()
      );
      userEvent.click(getByText(/add/i, {selector: 'button'}));

      await waitFor(() =>
        expect(queryByText(/add payments/i)).not.toBeInTheDocument()
      );

      await waitFor(() => {
        expect(getByText(t.charge?.code as string)).toBeInTheDocument();
        const container = getByText(t.charge?.code as string).parentElement
          ?.parentElement as HTMLElement;
        expect(container).toBeInTheDocument();

        const form = within(container).getByRole('form');
        expect(form).toBeInTheDocument();

        const amountInput = within(form).getByPlaceholderText(
          /amount/i
        ) as HTMLInputElement;
        expect(amountInput.value).toEqual(t.amount.toString());
      });
    }

    const enterPaymentDetailButton = getByText(/enter payment details/i, {
      selector: 'button',
    });
    await waitFor(() => expect(enterPaymentDetailButton).toBeInTheDocument());
    userEvent.click(enterPaymentDetailButton);

    await waitFor(() => expect(getByRole('form')).toBeInTheDocument());
    userEvent.type(getByPlaceholderText(/official receipt/i), orNumber);
    userEvent.click(getByText(/collect/i));

    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    expect(window.confirm).toBeCalled();
  });
});
