import React from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import {useReactToPrint} from 'react-to-print';

import {ApprovedAny} from '../../../@types';
import {PurchaseOrderAttr} from '../../../Api';
import {PrintPaper} from '../../@print-papers/PaperPdf';
import PurchaseOrder from '../../@print-papers/PurchaseOrder';

type Props = {
  buttonLabel: React.ReactNode;
  purchaseOrder: PurchaseOrderAttr | null;
};

const PrintPurchaseOrder = ({
  buttonLabel,
  purchaseOrder,
  ...buttonProps
}: Props & ButtonProps) => {
  const printPaperRef = React.createRef<ApprovedAny>();
  const handlePrint = useReactToPrint({
    bodyClass: 'print-body',
    content: () => printPaperRef.current,
    documentTitle: `PO-${purchaseOrder?.id}`,
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
          <PurchaseOrder purchaseOrder={purchaseOrder} />
        </PrintPaper>
      </div>
    </>
  );
};

export default PrintPurchaseOrder;
