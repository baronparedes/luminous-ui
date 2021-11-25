import React from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import {useReactToPrint} from 'react-to-print';

import {ApprovedAny} from '../../../@types';
import {PurchaseRequestAttr} from '../../../Api';
import {PrintPaper} from '../../@print-papers/PaperPdf';
import PurchaseRequest from '../../@print-papers/PurchaseRequest';

type Props = {
  buttonLabel: React.ReactNode;
  purchaseRequest: PurchaseRequestAttr | null;
};

const PrintPurchaseRequest = ({
  buttonLabel,
  purchaseRequest,
  ...buttonProps
}: Props & ButtonProps) => {
  const printPaperRef = React.createRef<ApprovedAny>();
  const handlePrint = useReactToPrint({
    bodyClass: 'print-body',
    content: () => printPaperRef.current,
    documentTitle: `PR-${purchaseRequest?.id}`,
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
      <div className="d-none">
        <PrintPaper ref={printPaperRef}>
          <PurchaseRequest purchaseRequest={purchaseRequest} />
        </PrintPaper>
      </div>
    </>
  );
};

export default PrintPurchaseRequest;
