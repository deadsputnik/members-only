process.loadEnvFile("./.env");

const express = require("express");
const app = express();
const path = require("node:path");
const router = require("./router");

const passport = require("passport");
require("./passport");
const session = require("express-session");

const { errorHandler } = require("./controller");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// session and passsport setup.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());

app.use((req, res, next) => {
  if (req.user) {
    const { first_name, last_name, password_hash, ...safeUser } = req.user;
    res.locals.currUser = safeUser;
  }
  next();
});

app.use("/", router);
app.use((req, res, next) =>
  next(Object.assign(new Error("Page not found"), { status: 404 })),
);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`App listening on port ${PORT}`);
});

// DEV CONVENIENCE
process.on("SIGINT", () => {
  console.log("Exiting...");
  server.close(() => {
    console.log("DONE");
    process.exit(0); // Exits only after all connections are cleanly closed
  });
});

process.on("SIGTSTP", () => {
  console.log("SUSPENDED - DID NOT KILL - TO KILL - run 'kill -9 %1'");
});
