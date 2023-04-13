function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function isString(value) {
  return typeof value === "string";
}

function isEmpty(value) {
  if (isObject(value)) return Object.keys(value).length === 0;
  else if (isArray(value) || isString(value)) return value.length === 0;
  else return true;
}

export { isObject, isArray, isString, isEmpty };
