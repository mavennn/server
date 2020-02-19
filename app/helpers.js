/**
 * Empty Function
 * check if value is empty
 * @param data
 * @returns {boolean}
 */
function empty(data) {
  if (data === null) return true;
  if (data === undefined) return true;
  if (data == "") return true;
  if (data == 0) return true;

  if (typeof data === "number" && isNaN(data)) return true;

  if (typeof data === "object") {
    for (const property in data) return false;
    return true;
  }
  return false;
}

/**
 * Uniq Function
 * create array of uniq elements of array
 * @param arr - array of any values
 * @returns {[]} - array of uniq elements in array
 */
function uniq(arr) {
  const result = [];

  for (const str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }

  return result;
}

/**
 * UniqByName
 * create array of uniq elements by 'name' element's field
 * @param arr - objects array
 * @returns {[]} - new array of uniq elements by 'name' field
 */
function uniqByName(arr) {
  const result = [];

  for (const obj of arr) {
    if (result.findIndex((x) => x.name === obj.name) === -1) {
      result.push(obj);
    }
  }

  return result;
}

/**
 * sortByScore
 * sorting array by 'score' field of object
 * @param arr
 */
function sortByScore(arr) {
  arr.sort((a, b) => (a.score > b.score ? 1 : -1));
}

/**
 * errJson
 * create object if request failed
 * @param errText
 * @returns {{data: *, type: string}}
 */
function erJson(errText) {
  return {
    type: "Error",
    data: errText,
  };
}

/**
 * suJson
 * create object if request success
 * @param data
 * @returns {{data: *, type: string}}
 */
function suJson(data) {
  return {
    type: "Success",
    data,
  };
}

export default {
  empty, erJson, suJson, uniq, uniqByName, sortByScore,
};
