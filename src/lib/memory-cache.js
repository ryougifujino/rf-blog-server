const cache = {};

function setItem(key, value) {
    if (typeof key !== 'string') {
        throw new Error('key must be a string');
    }
    cache[key] = value;
}

function getItem(key) {
    if (typeof key !== 'string') {
        throw new Error('key must be a string');
    }
    return cache[key];
}

module.exports = {
    setItem,
    getItem
};
