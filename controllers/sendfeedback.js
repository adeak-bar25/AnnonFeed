import DataModel from "../models/data.js";

// handle post request for send feedback

// Logic
// send feedback data to db -> redirect to thanks page

export default async function (req, res, next) {
    console.log(req.body);
    const result = await DataModel.insertNewFeedback(req.query.code, req.body.feedback, !req.body.name ? "Anonim" : req.body.name);

    // handle if code isn't available
    if (!result.modifiedCount > 0) {
        return res.redirect("/join");
    }

    res.redirect("/thanks");
}
