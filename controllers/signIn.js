import { generateEventCode } from "./utils/generate.js";
import EventModel from "../models/data.js";

// res.clearCookie("code");
// res.clearCookie("access");

// const code = eventCode();

// const accessCode = randomHex();

// const passwordHash = passwordHash(req.body.password);

// const currDb = { ...jsonDB() };
// currDb.events.push(eventJSON(htmlEscape(req.body.eventName), passwordHash, code, accessCode));
// writeFileSync(jsonFilePath, JSON.stringify(currDb, null, 2));
// res.cookie("code", code, { maxAge: 86400000, httpOnly: true });
// res.cookie("access", accessCode, { maxAge: 86400000, httpOnly: true });
// res.redirect(`/dashboard?code=${code}`);

export default async function (req, res, next) {
    try {
        const { accessCode, code } = await EventModel.createNewEvent(req.body.eventName, req.body.password);
        res.redirect(`/dashboard`);
        console.log(accessCode, code);
    } catch (err) {
        console.error(err);
        // next(err);
    }
}

function setCookie(res, obj) {
    Object.values(obj).forEach((c) => {
        res.cookie(c === obj.code ? "code" : "accessCode", c, {
            maxAge: 1000 * 60 * 60 * 24 * 5,
            httpOnly: true,
            sameSite: true
        });
    });
}
