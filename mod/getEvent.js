const fs = require('fs');


const jsonFilePath = './data/database.json';
const jsonDB = function(){
    return JSON.parse(fs.readFileSync(jsonFilePath))
};


const getEvent = {
    index: function (code) {
        return jsonDB().events.findIndex(event => event.code === parseInt(code));
    },
    availableCode: function () {
        return jsonDB().events.map((event) => event.code);
    },
    passwordHash: function (code) {
        const i = getEvent.index(code)
        return jsonDB().events[i].passwordHash
    }
}

module.exports = getEvent