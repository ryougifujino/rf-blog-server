function padNumber(targetNum, maxLength) {
    return String(targetNum).padStart(maxLength, '0');
}

/**
 * convert a UTC date string to local string
 * @param utcString - like 2019-03-21 12:46:22.556; any string can be put in new Date().
 */
const utcStringToLocal = utcString => {
    if (typeof utcString !== 'string') {
        return utcString;
    }
    let utcDate = new Date(utcString);
    if (isNaN(utcDate.getTime())) {
        throw new Error("wrong UTC string format");
    }
    const timezoneOffset = utcDate.getTimezoneOffset() * 60 * 1000;
    const ld = new Date(utcDate.getTime() - timezoneOffset);
    const isShort = utcString.trim().length === 10;
    const localTimePart = isShort ? "" : (' ' +
        padNumber(ld.getHours(), 2) + ':' +
        padNumber(ld.getMinutes(), 2) + ':' +
        padNumber(ld.getSeconds(), 2) + '.' +
        padNumber(ld.getMilliseconds(), 3));
    return ld.getFullYear() + '-' +
        padNumber(ld.getMonth() + 1, 2) + '-' +
        padNumber(ld.getDate(), 2) + localTimePart;
};

module.exports = {
    utcStringToLocal
};