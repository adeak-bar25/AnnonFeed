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

router.use("/dashboard", async (req, res, next) => await controllers.authMiddleware(req, res, next));

router.get("/dashboard", async (req, res, next) => await controllers.dashboard(req, res));

router.post("/new", async (req, res, next) => await controllers.signIn(req, res, next));

router.post("/join", (req, res) => res.redirect(`/feedback?code=${req.body.code}`));

router.post("/login", async (req, res, next) => await controllers.login(req, res, next));

router.get("/feedback", async (req, res, next) => await controllers.feedback(req, res, next));

router.post("/feedback/send", async (req, res, next) => await controllers.sendfeedback(req, res, next));

router.use((req, res) => {
    res.status(404);
    renderWebPage(res, "notfound", "Halaman Tidak Ditemukan");
});

router.use((err, req, res, next) => {
    res.status(500).json({ error: "Internal Server Error" });
    throw err;
});

export default router;
