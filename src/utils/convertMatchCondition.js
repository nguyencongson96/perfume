import keyQuery from "#root/config/product/keyQuery.config.js";

/**
 * Converts an array of values to an array of objects that can be used in a MongoDB query.
 * @param {Array} arr - The array of values to convert.
 * @param {String} key - The key to use in the objects.
 * @returns {Array} An array of objects that can be used in a MongoDB query.
 */
export default function convertMatchCondition(arr, key) {
  // If the key contains a number comparison symbol

  return keyQuery.numberCompare.includes(key)
    ? arr.length === 2
      ? arr.map((item, index) => (item ? { [key]: { [index === 0 ? "$gte" : "$lte"]: Number(item) } } : {}))
      : { [key]: { $eq: Number(arr[0]) } }
    : // If the key does not contain a number comparison symbol
    keyQuery.includeCompare.includes(key) //If the key contains an include comparison symbol
    ? arr.map((item) => (item ? { [key]: new RegExp(item, "i") } : {})) // Return an array of objects with a regular expression
    : arr.map((item) => (item ? { [key]: new RegExp(`^${item}$`, "i") } : {})); // Return an array of objects with a regular expression that matches exactly
}
