import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";

import expressSession from "express-session";
import "./app/config/passport";
import { notFound } from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import passport from "passport";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: [envVars.FRONTEND_URL, "http://localhost:5174", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Ride Booking System",
  });
});

app.use(globalErrorHandler);

app.use(notFound);
export default app;
