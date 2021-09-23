import React from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import {useReactToPrint} from 'react-to-print';

import {ApprovedAny} from '../../../@types';
import PaperStatementOfAccount, {
  PaperStatementOfAccountProps,
} from '../PaperStatementOfAccount';

const PrintStatementOfAccount = ({
  propertyAccount,
  assignedTo,
  month,
  year,
  ...buttonProps
}: PaperStatementOfAccountProps & ButtonProps) => {
  const printPaperRef = React.createRef<ApprovedAny>();
  const handlePrint = useReactToPrint({
    bodyClass: 'print-body',
    content: () => printPaperRef.current,
    documentTitle: 'Statement of Account',
  });

  return (
    <>
      <Button
        {...buttonProps}
        className="mb-2 w-100"
        onClick={() => {
          handlePrint && handlePrint();
        }}
      >
        print current statements
      </Button>
      <PaperStatementOfAccount
        ref={printPaperRef}
        propertyAccount={propertyAccount}
        assignedTo={assignedTo}
        month={month}
        year={year}
      />
    </>
  );
};

export default PrintStatementOfAccount;
