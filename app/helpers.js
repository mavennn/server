exports.empty = function(data) {
  if (data === null) return true;
  if (data === undefined) return true;
  if (data == "") return true;
  if (data == 0) return true;

  if (typeof data == "number" && isNaN(data)) return true;

  if (typeof data == "object") {
    for (var property in data) return false;
    return true;
  }
  return false;
};

exports.uniq = function (arr) {
  let result = [];

  for (let str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }

  return result;
};

exports.uniqByName = function (arr) {
  let result = [];

  for (let obj of arr) {
    if (result.findIndex(x => x.name === obj.name) === -1) {
      result.push(obj);
    }
  }

  return result;
};

exports.erJson = function (errText) {
  return {
    type: "Error",
    data: errText,
  }
};

exports.suJson = function (data) {
  return {
    type: "Success",
    data: data,
  }
};
