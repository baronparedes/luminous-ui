export function getInitials(name: string) {
  const names = name.split(' ');
  const first = names.shift();
  const last = names.pop();

  const format = (value?: string) => {
    if (value) return value.charAt(0).toUpperCase();
    return '';
  };

  return `${format(first)}${format(last)}`;
}
