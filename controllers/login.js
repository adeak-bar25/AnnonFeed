import { compare } from "bcrypt";
import DataModel from "../models/data.js";
import renderWebPage from "../views/utils/render.js";
import writeAccessCookie from "./utils/writeAccessCookie.js";

// handle login

// Logic
// Check Code sent by client, redirect back if not available, write access cookie and  redirect to dashboard if ok

export default async function (req, res, next) {
    if (!req.body.code) return res.redirect("/login");

    const data = DataModel.getInfoByEventCode(parseInt(req.body.code));

    // if the code is null redirect back to login page
    if (!data) {
        return renderWebPage(res, "login", "Login", {
            error: errorHtml("Kode yang anda masukkan tidak ditemukan!")
        });
    }

    // compare password sent by client
    const isAuth = compare(req.body.password, data.password);

    // if is not auth redirect it back to login page
    if (!isAuth) {
        return renderWebPage(res, "login", "Login", {
            error: errorHtml("Password yang anda masukkan salah!")
        });
    }

    const newAccessCookie = DataModel.generateNewAccessCode(data.code);
    writeAccessCookie(res, newAccessCookie);
    res.redirect("/dashboard?code=" + code);
}
