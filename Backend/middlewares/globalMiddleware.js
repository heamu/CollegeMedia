import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import passport from "passport";


const globalMiddleware = (app) => {
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }));

  app.use(express.json());
  app.use(cookieParser());

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 7,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production"
}

  }));

  app.use(passport.initialize());
  app.use(passport.session());
};

export default globalMiddleware;



// i have generated my SESSION-SECRET using the following command in my nodejs terminal
//node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

