import connection from "./config/connection.js";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import router from "./routes/routes.js";
import hbs from "hbs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import compression from "compression";

const start = performance.now();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3100;
const app = express();

app.use(compression());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", router);

app.listen(port, () => {
    const end = performance.now();
    console.log(`Aplikasi berjalan di http://localhost:${port}`);
    console.log(`Startup time : ${(end - start).toFixed(2)} ms`);
});
