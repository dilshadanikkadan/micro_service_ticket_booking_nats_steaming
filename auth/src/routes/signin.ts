import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "@dilutickets/common";
import { validateRequest } from "@dilutickets/common";
import { User } from "../model/users";
import { BadRequestError } from "@dilutickets/common";
import { Password } from "../service/password";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must provide a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("invalid credentials");
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("invalid credentials");
    }
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    res.status(200).json(existingUser);
  }
);

export { router as signinRouter };
