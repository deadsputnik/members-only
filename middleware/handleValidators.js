const { validationResult } = require("express-validator");

async function handleRegisterValidation(req, res, next) {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    const inputData = {};
    inputData.fname = req.body.fname;
    inputData.lname = req.body.lname;
    inputData.username = req.body.username;
    console.log(errors);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("register", { inputData, errors: errors.array() });
    }
  }
  console.log("validation successful");
  next();
}

async function handleSignInValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const inputUsername = req.body.username;
    res
      .status(400)
      .render("sign-in", { inputUsername, errors: errors.array() });
  }
  next();
}

async function handleNewMessageValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).render("new-message", { errors: errors.array() });
  }
  next();
}

async function handleValidateMessageId(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).render("/");
  }
  next();
}

module.exports = {
  handleRegisterValidation,
  handleSignInValidation,
  handleNewMessageValidation,
  handleValidateMessageId,
};
