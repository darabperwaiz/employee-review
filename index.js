const express = require("express");
const dotenv = require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 8000;

const path = require("path");
const db = require('./config/mongoose')

const expressLayouts = require("express-ejs-layouts");

const cookieParser = require("cookie-parser");

const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

const mongoStore = require("connect-mongo")(session);

const flash = require("connect-flash");
const customMiddleware = require("./config/middleware");

require("./config/view-helper")(app);

app.set("view engine", "ejs");

app.use(express.urlencoded());

app.use(cookieParser());

app.use(expressLayouts);
app.set("layout", "layout");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);



app.use(express.static("./assets"));

app.use(
  session({
    name: "employee",
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new mongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (error) {
        console.log(error || "connect-mongodb setup ok");
      }
    ),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);

app.use("/", require("./routes/index"));

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log(`App listening on port : ${PORT}`);
});
