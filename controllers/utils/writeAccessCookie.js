export default function (res, accessCode) {
    return res.cookie("accessCode", accessCode, { maxAge: 86400000, httpOnly: true });
}
