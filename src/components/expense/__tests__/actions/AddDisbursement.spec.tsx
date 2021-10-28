import faker from 'faker';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {formatDate} from '../../../../@utils/dates';
import {
  generateFakeDisbursement,
  generateFakeProfile,
} from '../../../../@utils/fake-models';
import {renderWithProvider} from '../../../../@utils/test-renderers';
import {DisbursementAttr, PaymentType} from '../../../../Api';
import {profileActions} from '../../../../store/reducers/profile.reducer';
import AddDisbursement from '../../actions/AddDisbursement';

describe('AddDisbursement', () => {
  const expectedTotalCost = faker.datatype.number();
  const mockedProfile = generateFakeProfile();

  async function renderTarget(
    paymentType: PaymentType,
    onDisburse?: (data: DisbursementAttr) => void
  ) {
    const target = renderWithProvider(
      <AddDisbursement maxValue={expectedTotalCost} onDisburse={onDisburse} />,
      store => store.dispatch(profileActions.signIn({me: mockedProfile}))
    );

    expect(target.getByTitle(/add disbursement/i)).toBeInTheDocument();

    userEvent.click(target.getByTitle(/add disbursement/i));
    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());

    const detailsInput = target.getByPlaceholderText(
      /details/i
    ) as HTMLInputElement;
    const paymentTypeInput = target.getByPlaceholderText(
      /payment type/i
    ) as HTMLSelectElement;
    const amountInput = target.getByPlaceholderText(
      /amount to release/i
    ) as HTMLInputElement;

    userEvent.selectOptions(paymentTypeInput, paymentType);

    const checkNumberInput = target.queryByPlaceholderText(
      /check number/i
    ) as HTMLInputElement | null;
    const checkPostingDateInput = target.queryByPlaceholderText(
      /check posting date/i
    ) as HTMLInputElement | null;
    const checkIssuingBankInput = target.queryByPlaceholderText(
      /check issuing bank/i
    ) as HTMLInputElement | null;

    expect(amountInput).toBeInTheDocument();
    expect(detailsInput).toBeInTheDocument();
    expect(paymentTypeInput).toBeInTheDocument();

    const fillupDisbursement = async (disbursement: DisbursementAttr) => {
      userEvent.type(detailsInput, disbursement.details);
      userEvent.clear(amountInput);
      userEvent.type(amountInput, disbursement.amount.toString());
      userEvent.selectOptions(paymentTypeInput, disbursement.paymentType);

      if (disbursement.paymentType === 'check') {
        userEvent.type(
          checkNumberInput as HTMLInputElement,
          disbursement.checkNumber as string
        );
        userEvent.type(
          checkPostingDateInput as HTMLInputElement,
          disbursement.checkPostingDate as string
        );
        userEvent.type(
          checkIssuingBankInput as HTMLInputElement,
          disbursement.checkIssuingBank as string
        );
      }
    };

    return {
      ...target,
      fillupDisbursement,
      amountInput,
      detailsInput,
      paymentTypeInput,
      checkNumberInput,
      checkPostingDateInput,
      checkIssuingBankInput,
    };
  }

  it('should render when payment type is cash', async () => {
    const {
      paymentTypeInput,
      checkNumberInput,
      checkPostingDateInput,
      checkIssuingBankInput,
    } = await renderTarget('cash');

    expect(paymentTypeInput.value).toEqual('cash');
    expect(checkNumberInput).not.toBeInTheDocument();
    expect(checkPostingDateInput).not.toBeInTheDocument();
    expect(checkIssuingBankInput).not.toBeInTheDocument();
  });

  it('should render when payment type is check', async () => {
    const {
      paymentTypeInput,
      checkIssuingBankInput,
      checkPostingDateInput,
      checkNumberInput,
    } = await renderTarget('check');

    expect(paymentTypeInput.value).toEqual('check');

    await waitFor(() => {
      expect(checkIssuingBankInput).toBeInTheDocument();
      expect(checkPostingDateInput).toBeInTheDocument();
      expect(checkNumberInput).toBeInTheDocument();
    });
  });

  it.each`
    paymentType
    ${'cash'}
    ${'check'}
  `(
    'should submit form correctly when payment type is $paymentType',
    async ({paymentType}) => {
      const mockOnDisburse = jest.fn();
      const mockedDisbursement: DisbursementAttr = {
        ...generateFakeDisbursement(),
        releasedBy: mockedProfile.id,
        paymentType,
      };
      const {fillupDisbursement, getByRole, getByText} = await renderTarget(
        paymentType,
        mockOnDisburse
      );

      await fillupDisbursement(mockedDisbursement);

      userEvent.click(getByText(/disburse/i, {selector: 'button'}));
      await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

      expect(mockOnDisburse).toHaveBeenCalled();
      if (paymentType === 'cash') {
        expect(mockOnDisburse).toHaveBeenCalledWith({
          ...mockedDisbursement,
          id: undefined,
          amount: mockedDisbursement.amount.toString(),
          checkPostingDate: '',
          checkIssuingBank: '',
          checkNumber: '',
        });
      } else {
        expect(mockOnDisburse).toHaveBeenCalledWith({
          ...mockedDisbursement,
          id: undefined,
          amount: mockedDisbursement.amount.toString(),
          checkPostingDate: formatDate(
            mockedDisbursement.checkPostingDate as string,
            'YYYY-MM-DD'
          ),
        });
      }
    }
  );

  it.each`
    field                    | paymentType
    ${/details/i}            | ${'cash'}
    ${/amount to release/i}  | ${'cash'}
    ${/details/i}            | ${'check'}
    ${/amount to release/i}  | ${'check'}
    ${/check number/i}       | ${'check'}
    ${/check posting date/i} | ${'check'}
    ${/check issuing bank/i} | ${'check'}
  `(
    'should require $field input when payment type is $paymentType',
    async ({field, paymentType}) => {
      const mockedDisbursement: DisbursementAttr = {
        ...generateFakeDisbursement(),
        paymentType,
      };
      const {fillupDisbursement, getByRole, getByText, getByPlaceholderText} =
        await renderTarget(paymentType);

      await fillupDisbursement(mockedDisbursement);

      userEvent.clear(getByPlaceholderText(field));
      await waitFor(() =>
        expect((getByRole('form') as HTMLFormElement).checkValidity()).toBe(
          false
        )
      );

      userEvent.click(getByText(/disburse/i, {selector: 'button'}));
      await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    }
  );
});