import React from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import {useReactToPrint} from 'react-to-print';

import {ApprovedAny} from '../../../@types';
import PaperStatementOfAccount from '../PaperStatementOfAccount';

type Props = {
  buttonLabel: string;
};

type PaperStatementOfAccountProps = React.ComponentProps<
  typeof PaperStatementOfAccount
>;

const PrintStatementOfAccount = ({
  buttonLabel,
  propertyAccount,
  propertyAssignments,
  month,
  year,
  ...buttonProps
}: Props & PaperStatementOfAccountProps & ButtonProps) => {
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
        onClick={() => {
          handlePrint && handlePrint();
        }}
      >
        {buttonLabel}
      </Button>
      <PaperStatementOfAccount
        ref={printPaperRef}
        propertyAccount={propertyAccount}
        propertyAssignments={propertyAssignments}
        month={month}
        year={year}
      />
    </>
  );
};

export default PrintStatementOfAccount;
