import {useMemo} from 'react';

import {Month, Period} from '../Api';

export type MonthOption = {
  value: Month;
  label: string;
};

type UseAvailablePeriodsProps = {
  periodsData?: Period[];
  selectedYear: number;
};

export function useAvailablePeriods({
  periodsData,
  selectedYear,
}: UseAvailablePeriodsProps) {
  const availableYears = useMemo(() => {
    return periodsData ? [...new Set(periodsData.map(f => f.year))] : [];
  }, [periodsData]);

  const allMonths: MonthOption[] = useMemo(
    () => [
      {value: 'JAN', label: 'January'},
      {value: 'FEB', label: 'February'},
      {value: 'MAR', label: 'March'},
      {value: 'APR', label: 'April'},
      {value: 'MAY', label: 'May'},
      {value: 'JUN', label: 'June'},
      {value: 'JUL', label: 'July'},
      {value: 'AUG', label: 'August'},
      {value: 'SEP', label: 'September'},
      {value: 'OCT', label: 'October'},
      {value: 'NOV', label: 'November'},
      {value: 'DEC', label: 'December'},
    ],
    []
  );

  const availableMonths = useMemo(() => {
    return (
      periodsData?.filter(p => p.year === selectedYear).map(p => p.month) ?? []
    );
  }, [periodsData, selectedYear]);

  const months = useMemo(() => {
    return allMonths.filter(m => availableMonths.includes(m.value));
  }, [allMonths, availableMonths]);

  const availablePeriods = useMemo(() => {
    return periodsData?.filter(p => p.year === selectedYear) || [];
  }, [periodsData, selectedYear]);

  return {
    availableYears,
    availableMonths,
    availablePeriods,
    months,
  };
}
