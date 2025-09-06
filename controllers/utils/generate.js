import { readFileSync } from "fs";
import { getAllAvailableCode } from "./getEvent.js";
import { hash } from "bcrypt";

// const jsonFilePath = "./data/database.json";

// const jsonDB = function () {
//     return JSON.parse(readFileSync(jsonFilePath));
// };

// export const generateEventJSON = (eventName, passwordHash, code, access) => {
//     return {
//         eventName,
//         passwordHash,
//         code,
//         feedback: [],
//         access,
//     };
// };
export const generateEventFeedback = (name, feedback) => {
    (name, feedback);
};

export const generateEventCode = function (existingCodes = []) {
    const generateCode = () => Math.floor(100000 + Math.random() * 900000);
    console.log(existingCodes);
    let generatedCode;
    do {
        generatedCode = generateCode();
    } while (existingCodes.includes(generatedCode));
    return generatedCode;
};

export const generateUUID = () => crypto.randomUUID();

export const generatePasswordHash = async (pass) => await hash(pass, 10);
