export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Reset hours to compare just the dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const isToday = today.getTime() === messageDate.getTime();
  
  // Format time as hh:mm 24h format
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  
  if (isToday) {
    return `Hoje às ${timeString}`;
  }
  
  // Check if it was yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = yesterday.getTime() === messageDate.getTime();
  
  if (isYesterday) {
    return `Ontem às ${timeString}`;
  }
  
  // Otherwise return full date and time
  return `${date.toLocaleDateString()} às ${timeString}`;
};

