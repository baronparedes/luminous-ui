import classNames from 'classnames';

import {currencyFormat, roundOff} from '../../@utils/currencies';

export type CurrencyProps = {
  currency: number;
  className?: string;
  noCurrencyColor?: boolean;
  noZero?: boolean;
  children?: React.ReactNode;
};

function getCurrencyColorCssClass(currency: number) {
  if (currency < 0) return 'text-danger';
  if (currency > 0) return 'text-success';
  return '';
}

export const Currency = (props: CurrencyProps) => {
  const currencyColor = props.noCurrencyColor
    ? ''
    : getCurrencyColorCssClass(props.currency);

  if (props.noZero && props.currency === 0) return null;
  return (
    <span className={classNames('currency', props.className, currencyColor)}>
      {currencyFormat(roundOff(props.currency))}
      {props.children}
    </span>
  );
};
