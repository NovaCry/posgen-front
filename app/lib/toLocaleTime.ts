export function toLocaleTime(date: Date) {
  return date.toLocaleString(window.navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}