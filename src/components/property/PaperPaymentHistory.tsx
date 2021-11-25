import React from 'react';

import {PrintPaper} from '../@print-papers/PaperPdf';
import PaymentHistory from '../@print-papers/PaymentHistory';

type Props = React.ComponentProps<typeof PaymentHistory>;

const PaperPaymentHistory = React.forwardRef<HTMLDivElement, Props>(
  ({...soaProps}, ref) => {
    return (
      <div className="d-none">
        <PrintPaper ref={ref}>
          <PaymentHistory {...soaProps} />
        </PrintPaper>
      </div>
    );
  }
);

export default PaperPaymentHistory;
