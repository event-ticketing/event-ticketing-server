const isoToGMT7 = (iso: string) => {
  let date = new Date(iso);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return new Intl.DateTimeFormat('en-GB', options).format(date).replace(',', '') + ' GMT+7';
};

export { isoToGMT7 };
