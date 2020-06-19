// well, the isISO stuff works now.. this is not longer needed.. i keep it for example

module.exports = {
    isGermanDate: function(value) {
    //todo: is this ok this way? or should this only return true/false and become sanitized in another func?
    if (!value.match(/^\d{2}.\d{2}.\d{4}$/)) return false;
    
    var parts = value.match(/(\d+)/g);

    //new Date(year, month, day); month is 0-based, therefore -1
    const date = new Date(parts[2], parts[1]-1, parts[0]);
    return date;
    }
}