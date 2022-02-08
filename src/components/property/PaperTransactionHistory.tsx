import React from 'react';

import {PrintPaper} from '../@print-papers/PaperPdf';
import TransactionHistory from '../@print-papers/TransactionHistory';

type Props = React.ComponentProps<typeof TransactionHistory>;

const PaperTransactionHistory = React.forwardRef<HTMLDivElement, Props>(
  ({...soaProps}, ref) => {
    return (
      <div className="d-none">
        <PrintPaper ref={ref}>
          <TransactionHistory {...soaProps} />
        </PrintPaper>
      </div>
    );
  }
);

export default PaperTransactionHistory;
