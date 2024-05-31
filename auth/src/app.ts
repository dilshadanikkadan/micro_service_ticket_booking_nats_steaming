import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "@dilutickets/common";
import { NotFoundError } from "@dilutickets/common";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { signinRouter } from "./routes/signin";
import { currentUserRouter } from "./routes/current-user";
import { signoutRouter } from "./routes/signout";


const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure:  process.env.NODE_ENV !== 'test',
  })
);


app.use(signupRouter);
app.use(signinRouter);
app.use(currentUserRouter);
app.use(signoutRouter);


app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app}

