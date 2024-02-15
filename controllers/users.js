const User = require("../models/user.js");

module.exports.renderSignUpForm = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    console.log(e);
    req.flash("error", e.message);
    // If there's an error we want to redirect back to the sign up page with the
    // flash message and show the form again so user can correct their errors
    res.status(409).redirect("/signup");
  }
};

module.exports.signUp = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "login successfully!!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(`${redirectUrl}`);
};

module.exports.logOut = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};
