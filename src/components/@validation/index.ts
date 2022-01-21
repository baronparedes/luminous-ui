import {Validate, ValidationRule} from 'react-hook-form';
import {GetDataError} from 'restful-react';

import {EntityError} from '../../Api';

export function getFieldErrorsFromRequest(
  e: GetDataError<EntityError> | null,
  name: string
) {
  if (e) {
    return (e.data as EntityError).fieldErrors?.find(fe => fe.field === name);
  }
  return undefined;
}

export const PATTERN_MATCH = {
  TWO_DECIMAL_PLACE_NUMBER: /^-?(\d+(\.\d{0,2})?|\.?\d{1,2})$/,
};

export const decimalPatternRule: ValidationRule<RegExp> = {
  value: PATTERN_MATCH.TWO_DECIMAL_PLACE_NUMBER,
  message: 'should be a number with up to 2 decimal places',
};

export const validateGreaterThanZero: Validate<number | undefined | null> =
  value => Number(value) > 0 || 'should be greater than 0';

export const validateGreaterThanOrEqualZero: Validate<
  number | undefined | null
> = value => Number(value) >= 0 || 'should be greater than or equal to 0';

export const validateNotEqualToZero: Validate<number | undefined> = value =>
  Number(value) !== 0 || 'should not be 0';

export const validateNoLeadingSpaces: Validate<string | undefined> = value =>
  value?.trimStart() === value || 'should not have leading spaces';

export const validateNoTrailingSpaces: Validate<string | undefined> = value =>
  value?.trimEnd() === value || 'should not have trailing spaces';

export const validateNotEmpty: Validate<string | undefined> = value =>
  value?.trim() !== '' || 'should not be empty';

export const validateUnique = (values: string[]) => {
  const validate: Validate<string | undefined> = value =>
    !values.map(v => v.toLowerCase()).includes(value?.toLowerCase() ?? '') ||
    'should be unique';
  return validate;
};

export const requiredIf = (condition?: boolean) => {
  const rule = (value: string | undefined) => {
    if (condition) {
      if (!value) return 'should be required';
      if (value.trim() === '') return 'should not be empty';
    }
    return true;
  };
  return rule;
};
