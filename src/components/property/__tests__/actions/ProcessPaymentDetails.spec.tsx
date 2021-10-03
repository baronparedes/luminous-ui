import faker from 'faker';

import {fireEvent, waitFor} from '@testing-library/react';

import {
  generateFakePaymentDetail,
  generateFakeProfile,
} from '../../../../@utils/fake-models';
import {renderWithProvider} from '../../../../@utils/test-renderers';
import {AuthProfile, PaymentDetailAttr, PaymentType} from '../../../../Api';
import {profileActions} from '../../../../store/reducers/profile.reducer';
import ProcessPaymentDetails from '../../actions/ProcessPaymentDetails';

type ProcessPaymentDetailsProps = React.ComponentProps<
  typeof ProcessPaymentDetails
>;

describe('ProcessPaymentDetails', () => {
  async function renderTarget(
    props: ProcessPaymentDetailsProps,
    paymentType?: PaymentType,
    profile?: AuthProfile
  ) {
    const target = renderWithProvider(
      <ProcessPaymentDetails {...props} />,
      store => store.dispatch(profileActions.signIn({me: profile}))
    );
    const toggleButton = target.getByText(/enter payment details/i);
    fireEvent.click(toggleButton);

    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());

    const orNumberInput = target.getByPlaceholderText(
      /official receipt/i
    ) as HTMLInputElement;
    const paymentTypeInput = target.getByPlaceholderText(
      /payment type/i
    ) as HTMLSelectElement;

    paymentType &&
      fireEvent.change(paymentTypeInput, {target: {value: paymentType}});

    const checkNumberInput = target.queryByPlaceholderText(
      /check number/i
    ) as HTMLInputElement | null;
    const checkPostingDateInput = target.queryByPlaceholderText(
      /check posting date/i
    ) as HTMLInputElement | null;
    const checkIssuingBankInput = target.queryByPlaceholderText(
      /check issuing bank/i
    ) as HTMLInputElement | null;

    return {
      ...target,
      toggleButton,
      orNumberInput,
      paymentTypeInput,
      checkNumberInput,
      checkPostingDateInput,
      checkIssuingBankInput,
    };
  }

  async function renderTargetAndFillupForm(
    props: ProcessPaymentDetailsProps,
    paymentDetail: PaymentDetailAttr,
    profile?: AuthProfile
  ) {
    const target = await renderTarget(
      props,
      paymentDetail.paymentType,
      profile
    );

    fireEvent.change(target.orNumberInput, {
      target: {value: paymentDetail.orNumber},
    });

    if (paymentDetail.paymentType === 'check') {
      fireEvent.change(target.checkNumberInput as HTMLInputElement, {
        target: {value: paymentDetail.checkNumber ?? ''},
      });
      fireEvent.change(target.checkPostingDateInput as HTMLInputElement, {
        target: {value: paymentDetail.checkPostingDate ?? ''},
      });
      fireEvent.change(target.checkIssuingBankInput as HTMLInputElement, {
        target: {value: paymentDetail.checkIssuingBank ?? ''},
      });
    }

    expect(target.orNumberInput.value).toEqual(paymentDetail.orNumber);
    expect(target.paymentTypeInput.value).toEqual(paymentDetail.paymentType);
    if (paymentDetail.paymentType === 'check') {
      expect(target.checkNumberInput?.value).toEqual(
        paymentDetail.checkNumber ?? ''
      );
      expect(target.checkPostingDateInput?.value).toEqual(
        paymentDetail.checkPostingDate ?? ''
      );
      expect(target.checkIssuingBankInput?.value).toEqual(
        paymentDetail.checkIssuingBank ?? ''
      );
    }

    return {
      ...target,
    };
  }

  it('should render when payment type is cash', async () => {
    const {
      orNumberInput,
      paymentTypeInput,
      checkIssuingBankInput,
      checkPostingDateInput,
      checkNumberInput,
    } = await renderTarget({totalCollected: faker.datatype.number()});
    expect(orNumberInput).toBeInTheDocument();
    expect(paymentTypeInput).toBeInTheDocument();
    expect(paymentTypeInput.value).toEqual('cash');
    expect(checkIssuingBankInput).not.toBeInTheDocument();
    expect(checkPostingDateInput).not.toBeInTheDocument();
    expect(checkNumberInput).not.toBeInTheDocument();
  });

  it('should render when payment type is check', async () => {
    const {
      orNumberInput,
      paymentTypeInput,
      checkIssuingBankInput,
      checkPostingDateInput,
      checkNumberInput,
    } = await renderTarget({totalCollected: faker.datatype.number()}, 'check');
    expect(orNumberInput).toBeInTheDocument();
    expect(paymentTypeInput).toBeInTheDocument();
    expect(checkIssuingBankInput).toBeInTheDocument();
    expect(checkPostingDateInput).toBeInTheDocument();
    expect(checkNumberInput).toBeInTheDocument();
  });

  it('should render and display totals', async () => {
    const totalCollected = faker.datatype.number();
    const totalChange = faker.datatype.number({min: 1});
    const {getByText} = await renderTarget({totalCollected, totalChange});
    expect(getByText(/total/i)).toBeInTheDocument();
    expect(getByText(/change/i)).toBeInTheDocument();
  });

  it('should render and hide total change when its value is less than or equal to 0 or undefined', async () => {
    const totalCollected = faker.datatype.number();
    const totalChange = faker.random.arrayElement([undefined, 0, -1]);
    const {queryByText} = await renderTarget({totalCollected, totalChange});
    expect(queryByText(/change/i)).not.toBeInTheDocument();
  });

  it.each`
    paymentType
    ${'cash'}
    ${'check'}
  `(
    'should submit form correctly when payment type is $paymentType',
    async ({paymentType}) => {
      window.confirm = jest.fn().mockImplementation(() => true);
      const mockOnCollect = jest.fn();
      const profile = generateFakeProfile();
      const paymentDetail = generateFakePaymentDetail(paymentType);
      const {getByText, queryByRole, getByRole} =
        await renderTargetAndFillupForm(
          {
            totalCollected: faker.datatype.number(),
            onCollect: mockOnCollect,
          },
          paymentDetail,
          profile
        );

      await waitFor(() =>
        expect((getByRole('form') as HTMLFormElement).checkValidity()).toBe(
          true
        )
      );

      fireEvent.click(getByText(/collect/i, {selector: 'button'}));
      await waitFor(() => {
        expect(mockOnCollect).toBeCalled();
      });
      if (paymentType === 'cash') {
        await waitFor(() => {
          expect(mockOnCollect).toBeCalledWith({
            orNumber: paymentDetail.orNumber,
            collectedBy: profile.id,
            paymentType: 'cash',
          });
        });
      } else {
        await waitFor(() => {
          expect(mockOnCollect).toBeCalledWith({
            ...paymentDetail,
            collectedBy: profile.id,
          });
        });
      }

      await waitFor(() =>
        expect(queryByRole('dialog')).not.toBeInTheDocument()
      );
    }
  );

  it.each`
    field                    | paymentType
    ${/official receipt/i}   | ${'cash'}
    ${/official receipt/i}   | ${'check'}
    ${/check number/i}       | ${'check'}
    ${/check posting date/i} | ${'check'}
    ${/check issuing bank/i} | ${'check'}
  `(
    'should require $field input when payment type is $paymentType',
    async ({field, paymentType}) => {
      const profile = generateFakeProfile();
      const paymentDetail = generateFakePaymentDetail(paymentType);
      const {getByPlaceholderText, getByRole, getByText} =
        await renderTargetAndFillupForm(
          {
            totalCollected: faker.datatype.number(),
          },
          paymentDetail,
          profile
        );

      fireEvent.change(getByPlaceholderText(field), {
        target: {value: ''},
      });

      await waitFor(() =>
        expect((getByRole('form') as HTMLFormElement).checkValidity()).toBe(
          false
        )
      );
      fireEvent.click(getByText(/collect/i, {selector: 'button'}));
      await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    }
  );
});
