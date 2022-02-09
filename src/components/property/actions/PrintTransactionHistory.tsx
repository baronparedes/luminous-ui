import React from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import {useReactToPrint} from 'react-to-print';

import {ApprovedAny} from '../../../@types';
import {VERBIAGE} from '../../../constants';
import PaperTransactionHistory from '../PaperTransactionHistory';

type Props = {
  buttonLabel: React.ReactNode;
};

type PaperTransactionHistoryProps = React.ComponentProps<
  typeof PaperTransactionHistory
>;

const PrintPaymentHistory = ({
  buttonLabel,
  property,
  data,
  ...buttonProps
}: Props & PaperTransactionHistoryProps & Omit<ButtonProps, 'property'>) => {
  const printPaperRef = React.createRef<ApprovedAny>();
  const handlePrint = useReactToPrint({
    bodyClass: 'print-body',
    content: () => printPaperRef.current,
    documentTitle: VERBIAGE.FILE_NAMES.TRANSACTION_HISTORY_DOC_TITLE(
      property?.code,
      data.targetYear
    ),
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
      <PaperTransactionHistory
        ref={printPaperRef}
        property={property}
        data={data}
      />
    </>
  );
};

export default PrintPaymentHistory;
