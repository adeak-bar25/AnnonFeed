import connection from "./config/connection.js";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import router from "./routes/routes.js";
import morgan from "morgan";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3100;
const app = express();

app.use(morgan("combined"));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", router);

app.listen(port, () => {
    console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
