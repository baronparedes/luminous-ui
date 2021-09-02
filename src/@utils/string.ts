export function getInitials(name: string) {
  const names = name.split(' ');
  const first = names.shift();
  const last = names.pop();
  return `${first?.charAt(0)}${last?.charAt(0)}`.toUpperCase();
}
