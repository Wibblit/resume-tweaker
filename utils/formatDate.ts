export function formatDate(date: string | Date, formatType: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  switch (formatType) {
    case "DD/MM/YYYY":
      return new Date(date).toLocaleDateString("en-GB"); // UK date format
    case "MM/DD/YYYY":
      return new Date(date).toLocaleDateString("en-US"); // US date format
    case "YYYY/MM/DD":
      return new Date(date).toLocaleDateString("ja-JP"); // Japan date format (YYYY/MM/DD)
    case "DD.MM.YYYY":
      return new Date(date).toLocaleDateString("de-DE"); // Germany date format (DD.MM.YYYY)
    case "Month DD, YYYY":
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }); // "January 31, 2025"
    case "MMM 'YY":
      const dateObj = new Date(date);
      return `${dateObj.toLocaleString("en-US", { month: "short" })} '${dateObj
        .getFullYear()
        .toString()
        .slice(-2)}`;
    case "MMM-YY":
      const dateObjMMMYY = new Date(date);
      return `${dateObjMMMYY.toLocaleString("en-US", {
        month: "short",
      })}-${dateObjMMMYY.getFullYear().toString().slice(-2)}`;
    case "MMM/YY":
      const dateObjMMMSlash = new Date(date);
      return `${dateObjMMMSlash.toLocaleString("en-US", {
        month: "short",
      })}/${dateObjMMMSlash.getFullYear().toString().slice(-2)}`;
    default:
      return date instanceof Date ? date.toString() : date; // Return original date if format is unknown
  }
}
