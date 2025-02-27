export function formatDate(date: Date) {
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return formattedDate;
}

export function getYearMonth(date: Date) {
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
  return formattedDate;
}

export function getDayMonthYear(date: Date) {
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return formattedDate;
}

export function getTime(date: Date) {
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    minute: "2-digit",
    hour: "2-digit",
    day: "2-digit",
    month: "long",
  }).format(date);
  return formattedDate;
}
