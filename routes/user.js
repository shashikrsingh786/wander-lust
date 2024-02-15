const express = require("express");
const router = express.Router();

const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  renderSignUpForm,
  signUp,
  renderLoginForm,
  login,
  logOut,
} = require("../controllers/users.js");



router.route("/signup").get(signUp).post(WrapAsync(renderSignUpForm));

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login
);
  
router.get("/logout", logOut);
module.exports = router;
