import React from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import {useReactToPrint} from 'react-to-print';

import {ApprovedAny} from '../../../@types';
import {VERBIAGE} from '../../../constants';
import PaperStatementOfAccount from '../PaperStatementOfAccount';

type Props = {
  buttonLabel: React.ReactNode;
};

type PaperStatementOfAccountProps = React.ComponentProps<
  typeof PaperStatementOfAccount
>;

const PrintStatementOfAccount = ({
  buttonLabel,
  propertyAccount,
  month,
  year,
  ...buttonProps
}: Props & PaperStatementOfAccountProps & ButtonProps) => {
  const printPaperRef = React.createRef<ApprovedAny>();
  const handlePrint = useReactToPrint({
    bodyClass: 'print-body',
    content: () => printPaperRef.current,
    documentTitle: VERBIAGE.SOA.DOC_TITLE(propertyAccount?.property?.code, {
      year,
      month,
    }),
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
        month={month}
        year={year}
      />
    </>
  );
};

export default PrintStatementOfAccount;
