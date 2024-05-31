import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { CurrentUser, errorHandler } from "@dilutickets/common";
import { NotFoundError } from "@dilutickets/common";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { indexTicketRouter } from "./routes";
import { showTicketRouter } from "./routes/show";
import { createTicketRouter } from "./routes/new";
import { updateTicketRouter } from "./routes/update";


const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure:  process.env.NODE_ENV !== 'test',
  })
);
app.use(CurrentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);



app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app}

