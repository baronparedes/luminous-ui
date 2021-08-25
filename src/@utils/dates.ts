export function getCurrentDateFormatted() {
  return formatDate(new Date());
}

export function formatDate(date: Date) {
  return date.toJSON().slice(0, 10).replace(/-/g, '-');
}

export function getCurrentDateTimeFormatted(date?: Date) {
  const now = date ?? new Date();
  return `${formatDate(now)} ${now.toLocaleTimeString()}`;
}
