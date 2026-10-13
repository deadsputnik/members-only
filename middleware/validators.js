const { body, param, query } = require("express-validator");

const validateRegister = [
  body("fname")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .bail()
    .isAlpha()
    .withMessage("First name must only contain letters."),
  body("lname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .bail()
    .isAlpha()
    .withMessage("Last name must only contain letters"),
  body("username")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username must only contain letters and numbers")
    .custom(async (value) => {
      const exists = await db.usernameExists(value);
      if (exists) throw new Error("Username already taken");
    }),
  body("password")
    .isStrongPassword({
      minUppercase: 0,
      minLowercase: 0,
      minLength: 8,
      maxLength: 72,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters long and contain a number and a special character",
    )
    .custom((value, { req }) => value === req.body.confirmPassword)
    .withMessage("Passwords do not match."),
];

const validateSignIn = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Are you sure your username is correct?"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ max: 72 })
    .withMessage("Max password length 72 characters"),
];

const sanitizeCode = [body("code").trim()];
const validateNewMessage = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 70 })
    .withMessage("Title needs to be between 1 and 70 characters long."),
  body("message")
    .trim()
    .isLength({ max: 250 })
    .withMessage("Message needs to be between 1 and 250 characters long."),
];

const validateMessageId = [
  param("messageId")
    .trim()
    .isInt({ min: 1 })
    .withMessage("messageId has to be an integer"),
];

const unlockMessage = [query("success").isInt({ min: 0, max: 1 })];

module.exports = {
  validateRegister,
  validateSignIn,
  sanitizeCode,
  validateNewMessage,
  validateMessageId,
  unlockMessage,
};
