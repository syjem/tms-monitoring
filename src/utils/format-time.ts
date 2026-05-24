export function formatTimeTo12Hour(time: string): string {
  if (!time) return '';

  const [hoursStr, minutes] = time.split(':');
  let hours = parseInt(hoursStr, 10);

  hours = hours % 12 || 12;

  return `${hours}:${minutes}`;
}
