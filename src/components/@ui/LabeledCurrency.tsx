import {Badge, BadgeProps} from 'react-bootstrap';

import {Currency, CurrencyProps} from './Currency';

type Props = {
  label: string;
  className?: string;
};

export const LabeledCurrency = ({
  label,
  className,
  noCurrencyColor,
  currency,
  ...rest
}: Props & BadgeProps & CurrencyProps) => {
  return (
    <div className={className}>
      <Badge {...rest}>{label}</Badge>
      <h4>
        <Currency noCurrencyColor={noCurrencyColor} currency={currency} />
      </h4>
    </div>
  );
};
