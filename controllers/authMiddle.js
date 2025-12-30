import DataModel from "../models/data.js";

// middleware to auth access to dashboard

// Logic
// check access code (on cookie) -> if access code is invalid, then redirect to login page, if ok let it pass

export default async function (req, res, next) {
    const redirectBadReq = () => res.status(400).redirect("/login");
    const issuedAccess = req.cookies.accessCode;

    if (!issuedAccess) redirectBadReq();

    if (!(await DataModel.validateAccessCode(issuedAccess))) redirectBadReq();

    next();
}
