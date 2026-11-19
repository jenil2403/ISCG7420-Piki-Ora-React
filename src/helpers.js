export function shortTime(value) {
  if (!value) return "";
  return String(value).slice(0, 5);
}

export function prettyDate(value) {
  if (!value) return "";
  const parts = String(value).split("-");
  if (parts.length !== 3) return value;
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return date.toLocaleDateString("en-NZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
