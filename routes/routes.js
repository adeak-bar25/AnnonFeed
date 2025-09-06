import express from "express";
import renderWebPage from "../views/utils/render.js";
import * as controllers from "../controllers/index.js";

const router = express.Router();

router.get("/", (req, res) => renderWebPage(res, "index", "Home"));

router.get("/new", (req, res) => renderWebPage(res, "new", "Buat Sesi Baru"));

router.get("/help", (req, res) => renderWebPage(res, "help", "Bantuan"));

router.get("/join", (req, res) => renderWebPage(res, "join", "Masuk ke Event"));

router.get("/login", (req, res) => renderWebPage(res, "login", "Login"));

router.get("/thanks", (req, res) => renderWebPage(res, "thanks", "Terima Kasih"));

router.use("/dashboard", async (req, res, next) => controllers.authMiddleware(req, res, next));

router.get("/dashboard", (req, res) => {
    renderWebPage(res, "dashboard", "Dashboard", {
        code: req.query.code,
        eventName: jsonDB().events[index(req.query.code)].eventName,
        fblength: jsonDB().events[i].feedback.length,
        feedback: fArray.join(" ")
    });
});

router.post("/new", async (req, res, next) => await controllers.signIn(req, res, next));

router.post("/join", (req, res) => res.redirect(`/feedback?code=${req.body.code}`));

router.post("/login", (req, res) => {
    const code = parseInt(req.body.code);
    if (!availableCode().includes(code))
        return renderWebPage(res, "login", "Login", {
            error: errorHtml("Kode yang anda masukkan tidak ditemukan!")
        });
    compare(req.body.password, __passwordHash(code), (err, result) => {
        if (err) console.err(err);
        if (result) {
            const accessCode = randomHex();
            const eventIndex = index(code);
            res.clearCookie("code");
            res.clearCookie("access");
            const curr = jsonDB();
            curr.events[eventIndex].access = accessCode;
            writeFileSync(jsonFilePath, JSON.stringify(curr, null, 2));

            res.cookie("code", code, { maxAge: 86400000, httpOnly: true });
            res.cookie("access", accessCode, { maxAge: 86400000, httpOnly: true });
            res.redirect("/dashboard?code=" + code);
        } else {
            // res.render('login', {error: generate.errorHtml('Password yang anda masukkan salah!')});
            renderWebPage(res, "login", "Login", {
                error: errorHtml("Password yang anda masukkan salah!")
            });
        }
    });
});

router.get("/feedback", (req, res) => {
    if (req.query.code === NaN || req.query.code === undefined) {
        // return res.render('join', {error: generate.errorHtml("Masukkan Code terlebih dahulu")});
        return renderWebPage(res, "join", "Masuk ke Event", {
            error: errorHtml("Masukkan Code terlebih dahulu")
        });
    } else if (!availableCode().includes(parseInt(req.query.code))) {
        // return res.render('join', {error : generate.errorHtml("Code yang anda masukkan salah!") });
        return renderWebPage(res, "join", "Masuk ke Event", {
            error: errorHtml("Code yang anda masukkan salah!")
        });
    }
    const code = parseInt(req.query.code);
    const eventIndex = index(code);
    const eventName = jsonDB().events[eventIndex].eventName;
    // res.render('feedback', {eventName : eventName });
    renderWebPage(res, "feedback", "Event Feedback", { eventName: eventName });
});

router.post("/feedback/send", (req, res) => {
    const code = req.query.code;
    let name = req.body.name == "" ? "Anonim" : htmlEscape(req.body.name);
    const feedbackMessage = eventFeedback(name, htmlEscape(req.body.feedback));
    const eventIndex = index(code);
    const curr = jsonDB();
    curr.events[eventIndex].feedback.push(feedbackMessage);
    try {
        writeFileSync(jsonFilePath, JSON.stringify(curr, null, 2));
    } catch (err) {
        throw err;
    }
    res.redirect("/thanks");
});

router.use((req, res) => {
    res.status(404);
    renderWebPage(res, "notfound", "Halaman Tidak Ditemukan");
});

router.use((err, req, res, next) => {
    res.status(500).json({ error: "Internal Server Error" });
    throw err;
});

function htmlEscape(text) {
    return String(text).replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export default router;
