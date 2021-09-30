export function currencyFormat(num?: number) {
  num = num ? num : 0;
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function currencyFixedFormat(num?: number) {
  num = num ? num : 0;
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function roundOff(num?: number) {
  if (!num) return 0;
  return num === 0 ? 0 : Math.round(num * 100) / 100;
}
