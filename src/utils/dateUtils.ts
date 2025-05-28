export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const daysBetween = (startDate: string, endDate: string): number => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the end date
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getEarliestDate = (items: { startDate: string }[]): string => {
  return items.reduce((earliest, item) => {
    return item.startDate < earliest ? item.startDate : earliest;
  }, items[0]?.startDate || '');
};

export const getLatestDate = (items: { endDate: string }[]): string => {
  return items.reduce((latest, item) => {
    return item.endDate > latest ? item.endDate : latest;
  }, items[0]?.endDate || '');
};

export const addDays = (dateString: string, days: number): string => {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

export const datesOverlap = (
  startA: string, 
  endA: string, 
  startB: string, 
  endB: string
): boolean => {
  return startA <= endB && startB <= endA;
};
