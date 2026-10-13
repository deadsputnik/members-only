const db = require("./db/queries");
const passport = require("passport");
const { matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");

async function getHome(req, res, next) {
  let isAdmin = false;
  let isMember = false;
  if (req.user) {
    isAdmin = req.user.admin;
    isMember = req.user.member;
  }

  try {
    const messages = await db.getMessages();
    res.render("home", { isAdmin, isMember, messages });
  } catch (error) {
    next(error);
  }
}

async function getRegister(req, res) {
  res.render("register");
}

async function createUser(req, res, next) {
  console.log("creating user");
  const { fname, lname, username, password } = matchedData(req);
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const rowCount = await db.createUser(
      fname,
      lname,
      username,
      hashedPassword,
    );
    if (rowCount !== 1) throw new Error("Failed to create user");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

async function getSignIn(req, res) {
  const messages = req.session.messages || [];
  // reset the message log, so only new messages are there.
  req.session.messages = [];
  res.render("sign-in", { messages });
}

const signInUser = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
    failureMessage: true,
  }),
];

function getUnlock(req, res) {
  const { success } = matchedData(req);
  const message = success === "1" ? "SUCCESS" : null;
  res.render("unlock", { message });
}

async function unlockMembership(req, res, next) {
  const { code } = matchedData(req);

  const actions = [
    [process.env.MEMBERSHIP_CODE, db.setMembership],
    [process.env.ADMIN_CODE, db.setAdmin],
  ];

  try {
    const match = actions.find(([secret]) => secret && secret === code);
    if (!match) {
      return res.status(400).render("unlock", { message: "Invalid code" });
    }
    const action = match[1];
    const rowCount = await action(req.user.id);
    if (rowCount === 0) {
      return next(new Error("User not found"));
    } else {
      return res.redirect("/unlock?success=1");
    }
  } catch (error) {
    next(error);
  }
}

function getNewMessage(req, res) {
  if (req.user) {
    res.render("new-message");
  } else {
    res.redirect("/");
  }
}

async function postNewMessage(req, res, next) {
  const { title, message } = matchedData(req);
  try {
    await db.createNewMessage(req.user.id, title, message);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

async function deleteMessage(req, res, next) {
  const { messageId } = matchedData(req);
  try {
    const delRowCount = await db.deleteMessage(messageId);
    if (delRowCount === 0) {
      return next(new Error("Error deleting message"));
    }
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

async function errorHandler(err, req, res, next) {
  console.log(err);
  if (res.headersSent) {
    return next(err);
  }
  console.log("errorHandler");
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  const message = status >= 500 ? "Internal server error" : err.message;
  res.status(err.status).render("error", { status, error: message });
}

module.exports = {
  getHome,
  getRegister,
  createUser,
  getSignIn,
  signInUser,
  errorHandler,
  getUnlock,
  unlockMembership,
  getNewMessage,
  postNewMessage,
  logout,
  deleteMessage,
};
