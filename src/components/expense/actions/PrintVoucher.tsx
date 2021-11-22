import React from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import {useReactToPrint} from 'react-to-print';

import {ApprovedAny} from '../../../@types';
import {VoucherAttr} from '../../../Api';
import {PrintPaper} from '../../@print-papers/PaperPdf';
import Voucher from '../../@print-papers/Voucher';

type Props = {
  buttonLabel: React.ReactNode;
  voucher: VoucherAttr | null;
};

const PrintVoucher = ({
  buttonLabel,
  voucher,
  ...buttonProps
}: Props & ButtonProps) => {
  const printPaperRef = React.createRef<ApprovedAny>();
  const handlePrint = useReactToPrint({
    bodyClass: 'print-body',
    content: () => printPaperRef.current,
    documentTitle: `V-${voucher?.id}`,
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
          <Voucher voucher={voucher} />
        </PrintPaper>
      </div>
    </>
  );
};

export default PrintVoucher;
