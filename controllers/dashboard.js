import renderWebPage from "../views/utils/render.js";
import DataModel from "../models/data.js";
// import render from "../views/utils/render.js";

// renderWebPage(res, "dashboard", "Dashboard", {
//   code: req.query.code,
//   eventName: jsonDB().events[index(req.query.code)].eventName,
//   fblength: jsonDB().events[i].feedback.length,
//   feedback: fArray.join(" ")
// });

// create

export default async function (req, res) {
    const { eventName, code, feedbacks } = await DataModel.getInfoByAccessCode(req.cookies.accessCode);
    renderWebPage(res, "dashboard", "Dashboard", {
        code,
        eventName,
        feedbacks,
        fblength: feedbacks.length
    });
}
