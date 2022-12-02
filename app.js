const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());



require("./config/config-passport")
app.use("", contactsRouter);
app.use("/avatars", express.static("../Node.js-02-restApi/public/avatars"));





module.exports = app;
