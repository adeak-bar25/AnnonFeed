import { generateEventCode } from "./utils/generate.js";
import EventModel from "../models/data.js";
import writeAccessCookie from "./utils/writeAccessCookie.js";

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

// Add New Event to db, set new cookie to client, redirect client to dashboard

export default async function (req, res, next) {
    try {
        const { accessCode } = await EventModel.createNewEvent(req.body.eventName, req.body.password);
        writeAccessCookie(res, accessCode);
        // res.cookie("accessCode", accessCode, { maxAge: 86400000, httpOnly: true });
        res.redirect(`/dashboard`);
    } catch (err) {
        console.error(err);
        // next(err);
    }
}
