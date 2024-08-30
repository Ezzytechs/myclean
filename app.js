const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

// const auth = require("./utils/jwt");

//CORS
const cors = require("cors");
app.use(cors());
app.options("*", cors());

//Env Variables
require("dotenv/config");
const api = process.env.API_URL;

//Database
require("./db/db");

app.use(express.json());

//Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
// app.use(auth);

//image path
app.use("/public/upload", express.static(__dirname + "/public/upload"));

//routers
const booksRouter = require("./routers/books");
const userRouter = require("./routers/users");
const servicesRouter = require("./routers/services");
const quotesRouter = require("./routers/quotes");

app.use(`${api}/bookings`, booksRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/services`, servicesRouter);
app.use(`${api}/quotes`, quotesRouter);

module.exports = app;
