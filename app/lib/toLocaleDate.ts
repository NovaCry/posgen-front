export function toLocaleDate(date: Date, noHour: boolean = false) {
  return date.toLocaleString(window.navigator.language, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...(() => {
      if (!noHour)
        return {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };
    })(),
  });
}
