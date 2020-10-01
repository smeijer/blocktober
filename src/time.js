function pad(num) {
  return num.toString().padStart(2, '0');
}

export function remaining(date) {
  const diff = new Date(date).getTime() - Date.now();
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const [count, unit] = days
    ? [days, 'day']
    : hours
    ? [hours, 'hour']
    : minutes
    ? [minutes, 'minute']
    : [seconds, 'second'];

  const friendly =
    unit === 'hour'
      ? `${pad(hours)}:${minutes}`
      : count === 1
      ? `1 ${unit}`
      : `${count} ${unit}s`;

  return {
    days,
    hours,
    minutes,
    seconds,
    friendly,
  };
}
