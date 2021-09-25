import moment from 'moment';

import {Month} from '../Api';

export function getCurrentDateFormatted() {
  return formatDate(new Date());
}

export function formatDate(date: Date) {
  return moment(date).format('YYYY-MMM-DD');
}

export function getCurrentDateTimeFormatted(date?: Date) {
  const now = date ?? new Date();
  return `${formatDate(now)} ${now.toLocaleTimeString()}`;
}

export function getCurrentMonthYear() {
  const [year, month] = moment().format('YYYY MMM').split(' ');
  return {
    year: Number(year),
    month: month.toUpperCase() as Month,
  };
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
