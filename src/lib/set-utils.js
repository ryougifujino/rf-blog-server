/**
 * // Examples
 * const setA = new Set([1, 2, 3, 4]),
 * setB = new Set([2, 3]),
 * setC = new Set([3, 4, 5, 6]);
 *
 * isSuperset(setA, setB); // => true
 * union(setA, setC); // => Set [1, 2, 3, 4, 5, 6]
 * intersection(setA, setC); // => Set [3, 4]
 * symmetricDifference(setA, setC); // => Set [1, 2, 5, 6]
 * difference(setA, setC); // => Set [1, 2]
 *
 */

function isSuperset(set, subset) {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}

function union(setA, setB) {
    const _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

function intersection(setA, setB) {
    const _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}

function symmetricDifference(setA, setB) {
    const _difference = new Set(setA);
    for (let elem of setB) {
        if (_difference.has(elem)) {
            _difference.delete(elem);
        } else {
            _difference.add(elem);
        }
    }
    return _difference;
}

function difference(setA, setB) {
    const _difference = new Set(setA);
    for (let elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}

module.exports = {
    isSuperset,
    union,
    intersection,
    symmetricDifference,
    difference
};