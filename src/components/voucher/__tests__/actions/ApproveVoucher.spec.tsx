import faker from 'faker';
import nock from 'nock';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {currencyFormat} from '../../../../@utils/currencies';
import {
  generateFakeDisbursement,
  generateFakeProfile,
  generateFakeVoucher,
} from '../../../../@utils/fake-models';
import {renderWithProviderAndRouterAndRestful} from '../../../../@utils/test-renderers';
import {DisbursementAttr} from '../../../../Api';
import {profileActions} from '../../../../store/reducers/profile.reducer';
import ApproveVoucher from '../../actions/ApproveVoucher';

describe('ApproveVoucher', () => {
  const base = 'http://localhost';
  const voucher = generateFakeVoucher();
  const chargeId = faker.datatype.number();
  const expectedTotalCost = faker.datatype.number();
  const mockedProfile = generateFakeProfile();

  async function renderTarget() {
    const target = renderWithProviderAndRouterAndRestful(
      <ApproveVoucher
        voucher={voucher}
        chargeId={chargeId}
        buttonLabel={'toggle'}
        totalCost={expectedTotalCost}
      />,
      base,
      store => store.dispatch(profileActions.signIn({me: mockedProfile}))
    );

    userEvent.click(target.getByText(/toggle/i));
    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());

    expect(
      target.getByText(`Approve V-${voucher.series ?? voucher.id}`)
    ).toBeInTheDocument();

    expect(target.getByText(/^approval codes$/i)).toBeInTheDocument();
    expect(target.getByPlaceholderText(/code/i)).toBeInTheDocument();
    expect(target.getByTitle(/add code/i)).toBeInTheDocument();

    expect(target.getByText(/remaining cost to disburse/i)).toBeInTheDocument();
    expect(
      target.getByText(currencyFormat(expectedTotalCost))
    ).toBeInTheDocument();
    expect(target.getByTitle(/add disbursement/i)).toBeInTheDocument();

    expect(target.getByText(/approve$/i, {selector: 'button'})).toBeDisabled();

    const addApprovalCode = async (approvalCode: string) => {
      userEvent.type(target.getByPlaceholderText(/code/i), approvalCode);
      userEvent.click(target.getByTitle(/add code/i));
      await waitFor(() =>
        expect(target.getByText(approvalCode)).toBeInTheDocument()
      );
    };

    const removeApprovalCode = async (approvalCode: string) => {
      const container = target.getByText(approvalCode)
        .parentElement as HTMLElement;
      userEvent.click(within(container).getByTitle(/remove code/i));
      await waitFor(() =>
        expect(target.queryByText(approvalCode)).not.toBeInTheDocument()
      );
    };

    const addDisbursement = async (disbursement: DisbursementAttr) => {
      userEvent.click(target.getByTitle(/add disbursement/i));
      await waitFor(() =>
        expect(target.getByText(/^add disbursements$/i)).toBeInTheDocument()
      );

      const detailsInput = target.getByPlaceholderText(
        /details/i
      ) as HTMLInputElement;
      const paymentTypeInput = target.getByPlaceholderText(
        /payment type/i
      ) as HTMLSelectElement;
      const amountInput = target.getByPlaceholderText(
        /amount to release/i
      ) as HTMLInputElement;

      const checkNumberInput = target.queryByPlaceholderText(
        /check number/i
      ) as HTMLInputElement | null;
      const checkPostingDateInput = target.queryByPlaceholderText(
        /check posting date/i
      ) as HTMLInputElement | null;
      const checkIssuingBankInput = target.queryByPlaceholderText(
        /check issuing bank/i
      ) as HTMLInputElement | null;

      userEvent.type(detailsInput, disbursement.details);
      userEvent.clear(amountInput);
      userEvent.type(amountInput, disbursement.amount.toString());
      userEvent.selectOptions(paymentTypeInput, disbursement.paymentType);

      if (disbursement.paymentType === 'check') {
        await waitFor(() => {
          expect(checkNumberInput).toBeInTheDocument();
          expect(checkPostingDateInput).toBeInTheDocument();
          expect(checkIssuingBankInput).toBeInTheDocument();
        });

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

      userEvent.click(target.getByText(/^disburse$/i));

      await waitFor(() =>
        expect(
          target.queryByText(/^add disbursements$/i)
        ).not.toBeInTheDocument()
      );

      await waitFor(() => {
        const container = target.getByText(disbursement.details)
          .parentElement as HTMLElement;
        expect(target.getByText(disbursement.details)).toBeInTheDocument();
        expect(
          within(container).getByText(currencyFormat(disbursement.amount))
        ).toBeInTheDocument();
        expect(
          within(container).getByText(disbursement.paymentType)
        ).toBeInTheDocument();
      });
    };

    const removeDisbursement = async (disbursement: DisbursementAttr) => {
      const container = target.getByText(disbursement.details).parentElement
        ?.parentElement as HTMLElement;
      userEvent.click(within(container).getByTitle(/remove disbursement/i));

      await waitFor(() => {
        expect(
          target.queryByText(disbursement.details)
        ).not.toBeInTheDocument();
      });
    };

    return {
      ...target,
      addApprovalCode,
      removeApprovalCode,
      addDisbursement,
      removeDisbursement,
    };
  }

  it('should render and toggle modal', async () => {
    await renderTarget();
  });

  it('should be able to add and remove approval codes', async () => {
    const expectedApprovalCode = faker.random.alphaNumeric(6);
    const {addApprovalCode, removeApprovalCode} = await renderTarget();

    await addApprovalCode(expectedApprovalCode);
    await removeApprovalCode(expectedApprovalCode);
  });

  it('should be able to add and remove disbursements', async () => {
    const expectedDisbursement: DisbursementAttr = {
      ...generateFakeDisbursement(),
      paymentType: 'cash',
    };
    const {addDisbursement, removeDisbursement} = await renderTarget();

    await addDisbursement(expectedDisbursement);
    await removeDisbursement(expectedDisbursement);
  });

  it('should disable approve button when approval codes minimum are not met', async () => {
    const [code1, code2] = [
      faker.random.alphaNumeric(6),
      faker.random.alphaNumeric(6),
    ];
    const expectedDisbursement: DisbursementAttr = {
      ...generateFakeDisbursement(),
      paymentType: 'cash',
      amount: expectedTotalCost,
    };

    const {addDisbursement, addApprovalCode, getByText} = await renderTarget();

    await addDisbursement(expectedDisbursement);
    await addApprovalCode(code1);
    await addApprovalCode(code2);
    await waitFor(() => expect(getByText(/^approve$/i)).toBeDisabled());
  });

  it('should disable approve button when amount to disbursed is not fully consumed', async () => {
    const [code1, code2, code3] = [
      faker.random.alphaNumeric(6),
      faker.random.alphaNumeric(6),
      faker.random.alphaNumeric(6),
    ];
    const expectedDisbursement: DisbursementAttr = {
      ...generateFakeDisbursement(),
      paymentType: 'cash',
      amount: expectedTotalCost - 1,
    };

    const {addDisbursement, addApprovalCode, getByText} = await renderTarget();

    await addDisbursement(expectedDisbursement);
    await addApprovalCode(code1);
    await addApprovalCode(code2);
    await addApprovalCode(code3);
    await waitFor(() => expect(getByText(/^approve$/i)).toBeDisabled());
  });

  it('should approve voucher when disbursements and approval codes are completed', async () => {
    const [code1, code2, code3] = [
      faker.random.alphaNumeric(6),
      faker.random.alphaNumeric(6),
      faker.random.alphaNumeric(6),
    ];
    const expectedDisbursement: DisbursementAttr = {
      ...generateFakeDisbursement(),
      paymentType: 'cash',
      amount: expectedTotalCost,
    };

    window.confirm = jest.fn().mockImplementation(() => true);

    const expectedRequest = {
      codes: [code1, code2, code3],
      voucherId: Number(voucher.id),
      disbursements: [
        {
          details: expectedDisbursement.details,
          releasedBy: mockedProfile.id,
          amount: expectedDisbursement.amount.toString(),
          paymentType: expectedDisbursement.paymentType,
          chargeId,
        },
      ],
    };

    nock(base)
      .post('/api/voucher/approveVoucher', actualRequest => {
        expect(actualRequest).toEqual(expectedRequest);
        return true;
      })
      .reply(200);

    const {addDisbursement, addApprovalCode, getByText} = await renderTarget();

    await addDisbursement(expectedDisbursement);
    await addApprovalCode(code1);
    await addApprovalCode(code2);
    await addApprovalCode(code3);
    await waitFor(() => expect(getByText(/^approve$/i)).toBeEnabled());

    userEvent.click(getByText(/^approve$/i));
    await waitFor(() => expect(window.confirm).toHaveBeenCalled());
  });
});
