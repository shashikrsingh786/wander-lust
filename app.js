if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const express = require("express");
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const UserModel = require("./models/user.js");
const dburl = process.env.ATLAS_DBURL;

async function main() {
  try {
    await mongoose.connect(dburl);
  } catch (err) {
    console.log(err);
  }
}

main()
  .then(() => console.log("connection is successful with database"))
  .catch((err) => console.log(err));

let port = 3080;

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("error in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

app.use(cookieParser("secret"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/public/js/script.js", (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.sendFile(__dirname + "/public/js/script.js");
});

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserModel.authenticate()));

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.listen(port, (req, res) => {
  console.log(`server listening at port : ${port}`);
  console.log("http://localhost:3080/listings");
});

app.use((req, res, next) => {
  res.locals.successM = req.flash("success");
  res.locals.errorM = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

//normal cookies
app.get("/cookies", (req, res) => {
  console.log(req.session);
  res.cookie("greet", "namaste");
  res.send("WE send you cookie");
});

//signed cookies
app.get("/signedcookies", (req, res) => {
  res.cookie("madeIn", "India", { signed: true });
  res.send("signed verified");
});

//verify
app.get("/verify", (req, res) => {
  console.dir(req.signedCookies);
  res.send(req.signedCookies);
});

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("server up and running....");
// });

app.all("*", (req, res) => {
  throw new ExpressError(404, "PAGE NOT FOUND");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "SOMETHING WENT WRONG" } = err;
  console.log("Error from Middleware", err);
  res.status(status).render("error.ejs", { message });
  // res.status(status).send(`${message} customs`);
});
