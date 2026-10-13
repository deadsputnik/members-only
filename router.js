const { Router } = require("express");
const router = Router();
const controller = require("./controller");
const { requireAuth, requireAdmin } = require("./middleware/auth");
const {
  validateRegister,
  validateSignIn,
  sanitizeCode,
  validateNewMessage,
  validateMessageId,
  unlockMessage,
} = require("./middleware/validators");
const {
  handleRegisterValidation,
  handleSignInValidation,
  handleNewMessageValidation,
  handleValidateMessageId,
} = require("./middleware/handleValidators");

router.get("/", controller.getHome);
router.get("/register", controller.getRegister);
router.get("/sign-in", controller.getSignIn);
router.get("/unlock", requireAuth, unlockMessage, controller.getUnlock);
router.get("/new-message", requireAuth, controller.getNewMessage);

router.post(
  "/register",
  validateRegister,
  handleRegisterValidation,
  controller.createUser,
);
router.post(
  "/sign-in",
  validateSignIn,
  handleSignInValidation,
  controller.signInUser,
);
router.post("/unlock", requireAuth, sanitizeCode, controller.unlockMembership);
router.post(
  "/new-message",
  requireAuth,
  validateNewMessage,
  handleNewMessageValidation,
  controller.postNewMessage,
);
router.post(
  "/:messageId/delete",
  requireAdmin,
  validateMessageId,
  handleValidateMessageId,
  controller.deleteMessage,
);
router.post("/logout", requireAuth, controller.logout);

module.exports = router;
