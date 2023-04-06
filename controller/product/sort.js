import sortStyle from "../../config/sortStyle.js";

//Require sortStyle is combination of key shorthand and method sorthand
function mergeSort(arr, method) {
  // If the array is empty or has only one element, it is already sorted
  if (arr.length <= 1 || !Array.isArray(arr)) return arr;
  if (!Object.values(sortStyle).includes(method)) return false;
  if (!method) method = "nac";

  let style = method.slice(1, 3),
    field = "name";
  if (method.slice(0, 1) === "n") field = "name";
  else if (method.slice(0, 1) === "p") field = "price";
  else return arr;

  // Find the middle point of the array
  let mid = Math.floor(arr.length / 2);

  // Divide the array into two halves
  let leftArr = mergeSort(arr.slice(0, mid), method);
  let rightArr = mergeSort(arr.slice(mid), method);

  // Merge the two halves
  let sortArr = [];
  while (leftArr.length && rightArr.length) {
    if (
      (style === "ac" && leftArr[0][field] < rightArr[0][field]) ||
      (style === "dc" && leftArr[0][field] > rightArr[0][field])
    ) {
      sortArr.push(leftArr[0]);
      leftArr.shift();
    } else {
      sortArr.push(rightArr[0]);
      rightArr.shift();
    }
  }

  // Add any remaining elements to the sorted array
  return sortArr.concat(leftArr, rightArr);
}

export default mergeSort;
