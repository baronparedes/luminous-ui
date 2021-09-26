import * as reactToPrint from 'react-to-print';

import {fireEvent, waitFor} from '@testing-library/react';

import {
  generateFakePropertyAccount,
  generateFakePropertyAssignment,
} from '../../../../@utils/fake-models';
import {renderWithProvider} from '../../../../@utils/test-renderers';
import PrintStatementOfAccount from '../../actions/PrintStatementOfAccount';

describe('PrintStatementOfAccount', () => {
  const mockedPropertyAccount = generateFakePropertyAccount();
  const mockedPropertyAssignments = [
    generateFakePropertyAssignment(),
    generateFakePropertyAssignment(),
  ];

  it('should render and print', async () => {
    const handlePrintFn = jest.fn();
    const mocked = jest.spyOn(reactToPrint, 'useReactToPrint');
    mocked.mockImplementation(() => handlePrintFn);

    const {getByText} = renderWithProvider(
      <PrintStatementOfAccount
        buttonLabel="print"
        year={2021}
        month={'SEP'}
        propertyAssignments={mockedPropertyAssignments}
        propertyAccount={mockedPropertyAccount}
      />
    );

    const button = getByText(/print/i, {selector: 'button'});
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    await waitFor(() => expect(handlePrintFn).toBeCalledTimes(1));
  });
});
