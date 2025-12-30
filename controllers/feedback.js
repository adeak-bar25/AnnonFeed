import DataModel from "../models/data.js";
import renderWebPage from "../views/utils/render.js";

// To handle get req to feedback page

// Logic
// if no or invalid code on query url, return to join page, render feedback page if the code is valid

export default async function (req, res, next) {
    // if req query is empty, redirect it to join page
    if (!req.query.code) {
        return renderWebPage(res, "join", "Masuk ke Event", {
            error: errorHtml("Masukkan Code terlebih dahulu")
        });
    }

    // get data based on code sent by client
    const data = await DataModel.getInfoByEventCode(req.query.code);

    // if data is empty, redirect to join page
    if (!data) {
        return renderWebPage(res, "join", "Masuk ke Event", {
            error: errorHtml("Code yang anda masukkan salah!")
        });
    }

    // display feedback page
    renderWebPage(res, "feedback", "Event Feedback", { eventName: data.eventName });
}
