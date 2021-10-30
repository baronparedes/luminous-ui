import moment from 'moment';

import {Month, Period} from '../Api';

export function getCurrentDateFormatted() {
  return formatDate(new Date());
}

export function formatDate(date: Date | string, format = 'YYYY-MMM-DD') {
  return moment(date).format(format);
}

export function getCurrentDateTimeFormatted(date?: Date) {
  const now = date ?? new Date();
  return `${formatDate(now)} ${now.toLocaleTimeString()}`;
}

export function getCurrentMonthYear(): Period {
  const [year, month] = moment().format('YYYY MMM').split(' ');
  return {
    year: Number(year),
    month: month.toUpperCase() as Month,
  };
}

export function getCurrentMonthYearRelativeToCutoff(cutoffDay: number) {
  const currentDay = moment().day();
  const period = getCurrentMonthYear();
  if (currentDay > cutoffDay) {
    return addFromYearMonth(period.year, period.month, 1);
  }
  return period;
}

export function toMonthValue(value: Month) {
  return Number(moment().month(value).format('M'));
}

export function toMonthName(value: number) {
  return moment().month(value).format('MMM').toUpperCase() as Month;
}

export function toTransactionPeriod(year: number, month: Month) {
  const dateString = `${year}-${moment().month(month).format('MM')}-01`;
  return new Date(dateString);
}

export function toTransactionPeriodFromDate(date: Date): Period {
  const [year, month] = moment(date).format('YYYY MMM').split(' ');
  return {
    year: Number(year),
    month: month.toUpperCase() as Month,
  };
}

export function addFromYearMonth(year: number, month: Month, amount: number) {
  const result = moment().month(month).year(year).add(amount, 'month');
  const [x, y] = result.format('YYYY-MMM').split('-');
  return {
    year: Number(x),
    month: y.toUpperCase() as Month,
  };
}

export function subtractFromYearMonth(
  year: number,
  month: Month,
  amount: number
) {
  const result = moment().month(month).year(year).subtract(amount, 'month');
  const [x, y] = result.format('YYYY-MMM').split('-');
  return {
    year: Number(x),
    month: y.toUpperCase() as Month,
  };
}

export function getPastYears(count: number) {
  const {year: currentYear} = getCurrentMonthYear();
  const past = currentYear - count;
  const pastYears: number[] = [];
  for (let i = past + 1; i <= past + count; i++) {
    pastYears.push(i);
  }
  return pastYears;
}

export function getMonthsUpToCurrent() {
  const {month: currentMonth} = getCurrentMonthYear();
  const monthValue = toMonthValue(currentMonth);
  const months: Month[] = [];
  for (let i = 0; i <= monthValue - 1; i++) {
    months.push(toMonthName(i));
  }
  return months;
}
