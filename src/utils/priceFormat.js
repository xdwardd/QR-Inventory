// Create a formatter for currency with desired options
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal", // or 'currency'
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});



/**
 * Convert a string or number to a 
 * currency string
 * @param {string | number} price Currency
 * in String Format
 * @returns 
 */
function priceFormat(price) {
    return priceFormatter.format(price);

}

export default priceFormat;