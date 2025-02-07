// components/DateConverter.tsx

import React from "react";

interface DateConverterProps {
  dateString: string;
}

const DateConverter = (dateString: string) => {
  console.log(dateString)
  const formatDate = (date: string) => {
    // Safely parse the input date string
    const dateObj = new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    const day = dateObj.getUTCDate(); // Get the day
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      dateObj
    ); // Get the month
    const year = dateObj.getUTCFullYear().toString().slice(-2); // Get the last 2 digits of the year

    return `${day}, ${month}'${year}`; // Format: dd, MMM'yy
  };

  return formatDate(dateString)
};

export default DateConverter;
