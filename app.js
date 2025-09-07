import connection from "./config/connection.js";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import router from "./routes/routes.js";

const port = process.env.PORT || 3100;
const app = express();

app.use(express.static("public"));
app.set("view engine", "hbs");
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", router);

app.listen(port, () => {
    console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
