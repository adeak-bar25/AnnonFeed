import { readFileSync } from 'fs';

const jsonFilePath = './data/database.json';

const jsonDB = function(){
    return JSON.parse(readFileSync(jsonFilePath))
}

export function index(code) {
    return jsonDB().events.findIndex(event => event.code === parseInt(code));
}

export function getAllAvailableCode() {
    return jsonDB().events.map((event) => event.code);
}
export function passwordHash(code) {
    const i = getEvent.index(code)
    return jsonDB().events[i].passwordHash
}
