import React from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import {useReactToPrint} from 'react-to-print';

import {ApprovedAny} from '../../../@types';
import {VERBIAGE} from '../../../constants';
import PaperPaymentHistory from '../PaperPaymentHistory';

type Props = {
  buttonLabel: React.ReactNode;
};

type PaperPaymentHistoryProps = React.ComponentProps<
  typeof PaperPaymentHistory
>;

const PrintPaymentHistory = ({
  buttonLabel,
  property,
  paymentHistory,
  availablePeriods,
  year,
  ...buttonProps
}: Props & PaperPaymentHistoryProps & Omit<ButtonProps, 'property'>) => {
  const printPaperRef = React.createRef<ApprovedAny>();
  const handlePrint = useReactToPrint({
    bodyClass: 'print-body',
    content: () => printPaperRef.current,
    documentTitle: VERBIAGE.FILE_NAMES.PAYMENT_HISTORY_DOC_TITLE(
      property?.code,
      year
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
      <PaperPaymentHistory
        ref={printPaperRef}
        property={property}
        paymentHistory={paymentHistory}
        availablePeriods={availablePeriods}
        year={year}
      />
    </>
  );
};

export default PrintPaymentHistory;
