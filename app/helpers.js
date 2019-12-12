function empty(data) {
    if (data === null) return true;
    if (data === undefined) return true;
    if (data == '') return true;
    if (data == 0) return true;

    if (typeof data == 'number' && isNaN(data)) return true;

    if (typeof data == 'object') {
        for (var property in data) return false;
        return true;
    }
    return false;
}

function uniq(arr) {
    let result = [];

    for (let str of arr) {
        if (!result.includes(str)) {
            result.push(str);
        }
    }

    return result;
}

function uniqByName(arr) {
    let result = [];

    for (let obj of arr) {
        if (result.findIndex((x) => x.name === obj.name) === -1) {
            result.push(obj);
        }
    }

    return result;
}

function sortByScore(arr) {
    arr.sort((a, b) => (a.score > b.score ? 1 : -1));
}

function erJson(errText) {
    return {
        type: 'Error',
        data: errText,
    };
}

function suJson(data) {
    return {
        type: 'Success',
        data: data,
    };
}

export default { empty, erJson, suJson, uniq, uniqByName, sortByScore };
