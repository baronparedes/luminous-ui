import React from 'react';

import {SETTING_KEYS} from '../../constants';
import {useRootState} from '../../store';
import {PrintPaper} from '../@ui/PaperPdf';
import SOA from '../@ui/SOA';

type Props = React.ComponentProps<typeof SOA>;

const PaperStatementOfAccount = React.forwardRef<HTMLDivElement, Props>(
  ({...soaProps}, ref) => {
    const notes = useRootState(state =>
      state.setting.values.find(v => v.key === SETTING_KEYS.SOA_NOTES)
    );
    return (
      <div className="d-none">
        <PrintPaper ref={ref}>
          <SOA {...soaProps} notes={notes} />
        </PrintPaper>
      </div>
    );
  }
);

export default PaperStatementOfAccount;
