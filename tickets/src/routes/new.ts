import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@dilutickets/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    console.log("current user", req.currentUser);
    console.log("hey", req.body);
    try {
      const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id || "dilshad",
      });
      await ticket.save();
      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });
      res.status(201).send(ticket);
    } catch (error) {
      console.log(error);
    }
  }
);

export { router as createTicketRouter };
