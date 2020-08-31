/**
 * capitalizes first character of string
 * @param {String} string 
 */
export function capitalizeFirstChar (string) {
  return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
}