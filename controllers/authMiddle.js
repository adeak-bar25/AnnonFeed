import DataModel from "../models/data.js";

export default async function (req, res, next) {
    const redirectBadReq = () => res.status(400).redirect("/login");
    const issuedAccess = req.cookies.accessCode;

    if (issuedAccess) redirectBadReq();

    if (!(await DataModel.validateAccessCode(issuedAccess))) redirectBadReq();

    next();
}
