import faker from 'faker';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeDisbursement,
  generateFakeProfile,
} from '../../../@utils/fake-models';
import {renderWithProvider} from '../../../@utils/test-renderers';
import {DisbursementAttr, PaymentType} from '../../../Api';
import {profileActions} from '../../../store/reducers/profile.reducer';
import AddDisbursement from '../AddDisbursement';

describe('AddDisbursement', () => {
  const expectedTotalCost = faker.datatype.number();
  const mockedProfile = generateFakeProfile();
  const expectedChargeId = faker.datatype.number();

  async function renderTarget(
    paymentType: PaymentType,
    onDisburse?: (data: DisbursementAttr) => void
  ) {
    const target = renderWithProvider(
      <AddDisbursement
        maxValue={expectedTotalCost}
        onDisburse={onDisburse}
        chargeId={expectedChargeId}
      />,
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
    const referenceNumberInput = target.queryByPlaceholderText(
      /reference number/i
    ) as HTMLInputElement | null;
    const transferBankInput = target.queryByPlaceholderText(
      /transfer bank/i
    ) as HTMLInputElement | null;
    const transferToInput = target.queryByPlaceholderText(
      /to gcash number/i
    ) as HTMLInputElement | null;
    const transferDateInput = target.queryByPlaceholderText(
      /transfer date/i
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
      if (disbursement.paymentType === 'bank-transfer') {
        userEvent.type(
          referenceNumberInput as HTMLInputElement,
          disbursement.referenceNumber as string
        );
        userEvent.type(
          transferDateInput as HTMLInputElement,
          disbursement.transferDate as string
        );
        userEvent.type(
          transferBankInput as HTMLInputElement,
          disbursement.transferBank as string
        );
      }
      if (disbursement.paymentType === 'gcash') {
        userEvent.type(
          referenceNumberInput as HTMLInputElement,
          disbursement.referenceNumber as string
        );
        userEvent.type(
          transferDateInput as HTMLInputElement,
          disbursement.transferDate as string
        );
        userEvent.type(
          transferToInput as HTMLInputElement,
          disbursement.transferTo as string
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
      transferBankInput,
      transferDateInput,
      transferToInput,
      referenceNumberInput,
    };
  }

  it('should render when payment type is cash', async () => {
    const {
      paymentTypeInput,
      checkNumberInput,
      checkPostingDateInput,
      checkIssuingBankInput,
      transferBankInput,
      transferDateInput,
      transferToInput,
      referenceNumberInput,
    } = await renderTarget('cash');

    expect(paymentTypeInput.value).toEqual('cash');
    expect(checkNumberInput).not.toBeInTheDocument();
    expect(checkPostingDateInput).not.toBeInTheDocument();
    expect(checkIssuingBankInput).not.toBeInTheDocument();
    expect(transferBankInput).not.toBeInTheDocument();
    expect(transferDateInput).not.toBeInTheDocument();
    expect(transferToInput).not.toBeInTheDocument();
    expect(referenceNumberInput).not.toBeInTheDocument();
  });

  it('should render when payment type is check', async () => {
    const {
      paymentTypeInput,
      checkIssuingBankInput,
      checkPostingDateInput,
      checkNumberInput,
      transferBankInput,
      transferDateInput,
      transferToInput,
      referenceNumberInput,
    } = await renderTarget('check');

    expect(paymentTypeInput.value).toEqual('check');

    await waitFor(() => {
      expect(checkIssuingBankInput).toBeInTheDocument();
      expect(checkPostingDateInput).toBeInTheDocument();
      expect(checkNumberInput).toBeInTheDocument();
      expect(transferBankInput).not.toBeInTheDocument();
      expect(transferDateInput).not.toBeInTheDocument();
      expect(transferToInput).not.toBeInTheDocument();
      expect(referenceNumberInput).not.toBeInTheDocument();
    });
  });

  it('should render when payment type is bank-transfer', async () => {
    const {
      paymentTypeInput,
      checkIssuingBankInput,
      checkPostingDateInput,
      checkNumberInput,
      transferBankInput,
      transferDateInput,
      transferToInput,
      referenceNumberInput,
    } = await renderTarget('bank-transfer');

    expect(paymentTypeInput.value).toEqual('bank-transfer');

    await waitFor(() => {
      expect(checkIssuingBankInput).not.toBeInTheDocument();
      expect(checkPostingDateInput).not.toBeInTheDocument();
      expect(checkNumberInput).not.toBeInTheDocument();
      expect(transferBankInput).toBeInTheDocument();
      expect(transferDateInput).toBeInTheDocument();
      expect(transferToInput).not.toBeInTheDocument();
      expect(referenceNumberInput).toBeInTheDocument();
    });
  });

  it('should render when payment type is gcash', async () => {
    const {
      paymentTypeInput,
      checkIssuingBankInput,
      checkPostingDateInput,
      checkNumberInput,
      transferBankInput,
      transferDateInput,
      transferToInput,
      referenceNumberInput,
    } = await renderTarget('gcash');

    expect(paymentTypeInput.value).toEqual('gcash');

    await waitFor(() => {
      expect(checkIssuingBankInput).not.toBeInTheDocument();
      expect(checkPostingDateInput).not.toBeInTheDocument();
      expect(checkNumberInput).not.toBeInTheDocument();
      expect(transferBankInput).not.toBeInTheDocument();
      expect(transferDateInput).toBeInTheDocument();
      expect(transferToInput).toBeInTheDocument();
      expect(referenceNumberInput).toBeInTheDocument();
    });
  });

  it.each`
    paymentType
    ${'cash'}
    ${'check'}
    ${'bank-transfer'}
    ${'gcash'}
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
          chargeId: expectedChargeId,
          checkPostingDate: '',
          checkIssuingBank: '',
          checkNumber: '',
          transferBank: '',
          transferDate: '',
          transferTo: '',
          referenceNumber: '',
        });
      } else if (paymentType === 'check') {
        expect(mockOnDisburse).toHaveBeenCalledWith({
          ...mockedDisbursement,
          id: undefined,
          chargeId: expectedChargeId,
          amount: mockedDisbursement.amount.toString(),
          checkPostingDate: mockedDisbursement.checkPostingDate?.substr(0, 10),
          transferBank: '',
          transferDate: '',
          transferTo: '',
          referenceNumber: '',
        });
      } else if (paymentType === 'bank-transfer' || paymentType === 'gcash') {
        expect(mockOnDisburse).toHaveBeenCalledWith({
          ...mockedDisbursement,
          id: undefined,
          chargeId: expectedChargeId,
          amount: mockedDisbursement.amount.toString(),
          transferBank:
            paymentType === 'bank-transfer'
              ? mockedDisbursement.transferBank
              : '',
          transferDate: mockedDisbursement.transferDate?.substr(0, 10),
          transferTo:
            paymentType === 'gcash' ? mockedDisbursement.transferTo : '',
          referenceNumber: mockedDisbursement.referenceNumber,
          checkPostingDate: '',
          checkIssuingBank: '',
          checkNumber: '',
        });
      }
    }
  );

  it.each`
    field                    | skipEmptyCheck | paymentType
    ${/details/i}            | ${false}       | ${'cash'}
    ${/details/i}            | ${false}       | ${'check'}
    ${/details/i}            | ${false}       | ${'bank-transfer'}
    ${/details/i}            | ${false}       | ${'gcash'}
    ${/amount to release/i}  | ${true}        | ${'cash'}
    ${/amount to release/i}  | ${true}        | ${'check'}
    ${/amount to release/i}  | ${true}        | ${'bank-transfer'}
    ${/amount to release/i}  | ${true}        | ${'gcash'}
    ${/check number/i}       | ${false}       | ${'check'}
    ${/check posting date/i} | ${true}        | ${'check'}
    ${/check issuing bank/i} | ${false}       | ${'check'}
    ${/reference number/i}   | ${false}       | ${'bank-transfer'}
    ${/transfer bank/i}      | ${false}       | ${'bank-transfer'}
    ${/transfer date/i}      | ${true}        | ${'bank-transfer'}
    ${/reference number/i}   | ${false}       | ${'gcash'}
    ${/to gcash number/i}    | ${false}       | ${'gcash'}
    ${/transfer date/i}      | ${true}        | ${'gcash'}
  `(
    'should require $field input or not be empty when payment type is $paymentType',
    async ({field, paymentType, skipEmptyCheck}) => {
      const mockedDisbursement: DisbursementAttr = {
        ...generateFakeDisbursement(),
        paymentType,
      };
      const {fillupDisbursement, getByRole, getByText, getByPlaceholderText} =
        await renderTarget(paymentType);

      await fillupDisbursement(mockedDisbursement);

      userEvent.clear(getByPlaceholderText(field));
      userEvent.click(getByText(/disburse/i, {selector: 'button'}));
      await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

      if (!skipEmptyCheck) {
        userEvent.type(getByPlaceholderText(field), ' ');
        userEvent.click(getByText(/disburse/i, {selector: 'button'}));
        await waitFor(() =>
          expect(getByText(/should not be empty/i)).toBeInTheDocument()
        );
      }

      await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    }
  );
});
