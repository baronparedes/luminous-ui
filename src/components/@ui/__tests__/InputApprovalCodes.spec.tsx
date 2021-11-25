import faker from 'faker';

import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import InputApprovalCodes from '../InputApprovalCodes';

describe('InputApprovalCodes', () => {
  it('should render and add approval code', async () => {
    const approvalCode = faker.random.alphaNumeric(6);
    const mockOnInputCode = jest.fn();
    const {getByTitle, getByPlaceholderText} = render(
      <InputApprovalCodes codes={[]} onInputCode={mockOnInputCode} />
    );
    userEvent.type(getByPlaceholderText(/code/i), approvalCode);
    userEvent.click(getByTitle(/add code/i));

    await waitFor(() => {
      expect(mockOnInputCode).toHaveBeenCalled();
      expect(mockOnInputCode).toHaveBeenCalledWith(approvalCode);
    });
  });

  it.each`
    description          | expectedErrorLabel                    | invalidValue
    ${'empty string'}    | ${/should not be empty/i}             | ${' '}
    ${'leading spaces'}  | ${/should not have leading spaces/i}  | ${' 23456'}
    ${'trailing spaces'} | ${/should not have trailing spaces/i} | ${'12345 '}
    ${'duplicate value'} | ${/should be unique/i}                | ${'123456'}
    ${'min length of 6'} | ${undefined}                          | ${faker.random.alphaNumeric(5)}
  `(
    'should not accept invalid values [$description]',
    async ({invalidValue, expectedErrorLabel}) => {
      const mockOnInputCode = jest.fn();
      const {getByTitle, getByText, getByPlaceholderText} = render(
        <InputApprovalCodes codes={['123456']} onInputCode={mockOnInputCode} />
      );

      userEvent.type(getByPlaceholderText(/code/i), invalidValue);
      userEvent.click(getByTitle(/add code/i));
      if (expectedErrorLabel) {
        await waitFor(() =>
          expect(getByText(expectedErrorLabel)).toBeInTheDocument()
        );
      }

      await waitFor(() => {
        expect(mockOnInputCode).not.toHaveBeenCalled();
      });
    }
  );
});
