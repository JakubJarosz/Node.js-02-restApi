const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   res.status(404).json({ message: "Not found" });
// });


app.use("/api/contacts", contactsRouter);

let db = {
  users: [{id: 1}, {id: 2}]
}

// app.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message });
// });

// app.get("/", (req, res) => {
//   res.send("hello worlds");
// });

// app.get("/gg", (req, res) => {
//   res.json(db.users)
// });

// app.get("/gg/:id", (req, res) => {

//   res.json(db.users);
// });

module.exports = app;
