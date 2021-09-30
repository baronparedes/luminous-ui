import {Validate, ValidationRule} from 'react-hook-form';

export const PATTERN_MATCH = {
  TWO_DECIMAL_PLACE_NUMBER: /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/,
};

export const decimalPatternRule: ValidationRule<RegExp> = {
  value: PATTERN_MATCH.TWO_DECIMAL_PLACE_NUMBER,
  message: 'should be a number with up to 2 decimal places',
};

export const validateGreaterThanZero: Validate<number | undefined> = value =>
  Number(value) > 0 || 'should be greater than 0';
