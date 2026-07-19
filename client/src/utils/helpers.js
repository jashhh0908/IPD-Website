/**
 * Formats an ISO date string to a formal date (e.g., "07 May 2026")
 * @param {string} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

/**
 * Formats an ISO date string to 12-hour time (e.g., "02:23 pm")
 * @param {string} dateString 
 * @returns {string}
 */
export function formatTime(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const formattedHours = String(hours).padStart(2, '0');
  
  return `${formattedHours}:${minutes} ${ampm}`;
}

/**
 * Formats an ISO date string to date & time (e.g., "07 May 2026, 02:23 pm")
 * @param {string} dateString 
 * @returns {string}
 */
export function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
}

/**
 * Formats a number to Indian Rupee (INR) currency style (e.g., "₹2,85,000")
 * @param {number} amount 
 * @returns {string}
 */
export function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
}
