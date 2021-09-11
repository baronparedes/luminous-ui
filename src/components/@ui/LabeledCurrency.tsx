import {Badge, BadgeProps} from 'react-bootstrap';

import {Currency, CurrencyProps} from './Currency';

type Props = {
  label: string;
  className?: string;
};

export const LabeledCurrency = (props: Props & BadgeProps & CurrencyProps) => {
  return (
    <div className={props.className}>
      <Badge {...props}>{props.label}</Badge>
      <h5>
        <Currency {...props} />
      </h5>
    </div>
  );
};
