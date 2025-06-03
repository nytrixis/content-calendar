// Indian Standard Time utilities
const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

/**
 * Get current time in IST
 */
export function getCurrentISTTime(): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + IST_OFFSET);
}

/**
 * Convert any date to IST
 */
export function convertToIST(date: Date | string): Date {
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(inputDate.getTime())) {
    console.error('Invalid date input:', date);
    return new Date();
  }
  
  const utc = inputDate.getTime() + (inputDate.getTimezoneOffset() * 60000);
  return new Date(utc + IST_OFFSET);
}

/**
 * Create a date from IST date and time strings
 */
export function createISTDateTime(dateString: string, timeString: string): Date {
  try {
    console.log('Creating IST DateTime:', { dateString, timeString });
    
    // Validate inputs
    if (!dateString || !timeString) {
      throw new Error('Missing date or time');
    }
    
    // Clean the inputs
    const cleanDate = dateString.trim();
    const cleanTime = timeString.trim();
    
    console.log('Cleaned inputs:', { cleanDate, cleanTime });
    
    // Parse date components
    const [year, month, day] = cleanDate.split('-').map(Number);
    const [hours, minutes] = cleanTime.split(':').map(Number);
    
    // Validate parsed values
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
      throw new Error('Invalid date or time format');
    }
    
    // Create date in IST (as local time)
    const istDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    
    // Convert to UTC for storage by subtracting IST offset
    const utcTime = istDate.getTime() - IST_OFFSET;
    const utcDate = new Date(utcTime);
    
    console.log('Created IST date:', istDate);
    console.log('Converted to UTC:', utcDate);
    console.log('UTC ISO string:', utcDate.toISOString());
    
    return utcDate;
    
  } catch (error) {
    console.error('Error in createISTDateTime:', error);
    
    // Fallback: try creating with ISO string
    try {
      const isoString = `${dateString}T${timeString}:00.000Z`;
      const fallbackDate = new Date(isoString);
      
      if (!isNaN(fallbackDate.getTime())) {
        console.log('Fallback successful:', fallbackDate);
        return fallbackDate;
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
    
    // Last resort
    console.log('Using current date as last resort');
    return new Date();
  }
}

/**
 * Format date for HTML date input (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
  const istDate = convertToIST(date);
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time for HTML time input (HH:MM)
 */
export function formatTimeForInput(date: Date | string): string {
  const istDate = convertToIST(date);
  const hours = String(istDate.getHours()).padStart(2, '0');
  const minutes = String(istDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format date for display with full details
 */
export function formatDisplayDate(dateString: string): string {
  try {
    const istDate = convertToIST(dateString);
    
    return istDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting display date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format time for display
 */
export function formatDisplayTime(dateString: string): string {
  try {
    const istDate = convertToIST(dateString);
    
    return istDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting display time:', error);
    return 'Invalid Time';
  }
}

/**
 * Check if two dates are the same day in IST
 */
export function isSameDayIST(date1: string | Date, date2: string | Date): boolean {
  try {
    const istDate1 = convertToIST(date1);
    const istDate2 = convertToIST(date2);
    
    const isSame = (
      istDate1.getFullYear() === istDate2.getFullYear() &&
      istDate1.getMonth() === istDate2.getMonth() &&
      istDate1.getDate() === istDate2.getDate()
    );
    
    return isSame;
  } catch (error) {
    console.error('Error in isSameDayIST:', error);
    return false;
  }
}

/**
 * Get date string in IST
 */
export function getISTDateString(date: Date | string): string {
  const istDate = convertToIST(date);
  return istDate.toDateString();
}

/**
 * Get hour in IST (0-23)
 */
export function getISTHour(date: Date | string): number {
  const istDate = convertToIST(date);
  return istDate.getHours();
}

/**
 * Get day of month in IST (1-31)
 */
export function getISTDay(date: Date | string): number {
  const istDate = convertToIST(date);
  return istDate.getDate();
}

/**
 * Get month in IST (0-11)
 */
export function getISTMonth(date: Date | string): number {
  const istDate = convertToIST(date);
  return istDate.getMonth();
}

/**
 * Get year in IST
 */
export function getISTYear(date: Date | string): number {
  const istDate = convertToIST(date);
  return istDate.getFullYear();
}

/**
 * Check if a date is today in IST
 */
export function isToday(date: Date | string): boolean {
  const today = getCurrentISTTime();
  return isSameDayIST(date, today);
}

/**
 * Get start of day in IST (00:00:00.000)
 */
export function getStartOfDayIST(date: Date | string): Date {
  const istDate = convertToIST(date);
  
  // Set to start of day in IST
  const startOfDay = new Date(
    istDate.getFullYear(),
    istDate.getMonth(),
    istDate.getDate(),
    0, 0, 0, 0
  );
  
  // Convert back to UTC for storage/comparison
  const utcTime = startOfDay.getTime() - IST_OFFSET;
  return new Date(utcTime);
}

/**
 * Get end of day in IST (23:59:59.999)
 */
export function getEndOfDayIST(date: Date | string): Date {
  const istDate = convertToIST(date);
  
  // Set to end of day in IST
  const endOfDay = new Date(
    istDate.getFullYear(),
    istDate.getMonth(),
    istDate.getDate(),
    23, 59, 59, 999
  );
  
  // Convert back to UTC for storage/comparison
  const utcTime = endOfDay.getTime() - IST_OFFSET;
  return new Date(utcTime);
}

/**
 * Get week start date (Sunday) in IST
 */
export function getWeekStartIST(date: Date | string): Date {
  const istDate = convertToIST(date);
  const dayOfWeek = istDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  const weekStart = new Date(istDate);
  weekStart.setDate(istDate.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  
  // Convert back to UTC
  const utcTime = weekStart.getTime() - IST_OFFSET;
  return new Date(utcTime);
}

/**
 * Get month start date in IST
 */
export function getMonthStartIST(date: Date | string): Date {
  const istDate = convertToIST(date);
  
  const monthStart = new Date(
    istDate.getFullYear(),
    istDate.getMonth(),
    1,
    0, 0, 0, 0
  );
  
  // Convert back to UTC
  const utcTime = monthStart.getTime() - IST_OFFSET;
  return new Date(utcTime);
}

/**
 * Check if date is in current week (IST)
 */
export function isThisWeekIST(date: Date | string): boolean {
  const today = getCurrentISTTime();
  const inputDate = convertToIST(date);
  
  const weekStart = getWeekStartIST(today);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return inputDate >= convertToIST(weekStart) && inputDate <= convertToIST(weekEnd);
}

/**
 * Check if date is in current month (IST)
 */
export function isThisMonthIST(date: Date | string): boolean {
  const today = getCurrentISTTime();
  const inputDate = convertToIST(date);
  
  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth()
  );
}

/**
 * Debug function to log date information
 */
export function debugDate(date: Date | string, label: string = 'Date'): void {
  console.log(`=== ${label} Debug ===`);
  console.log('Input:', date);
  console.log('Type:', typeof date);
  
  if (typeof date === 'string') {
    console.log('Parsed Date:', new Date(date));
  }
  
  const istDate = convertToIST(date);
  console.log('IST Date:', istDate);
  console.log('IST String:', istDate.toString());
  console.log('IST Date String:', istDate.toDateString());
  console.log('IST Time String:', istDate.toTimeString());
  console.log('IST ISO String:', istDate.toISOString());
  console.log('=================');
}
