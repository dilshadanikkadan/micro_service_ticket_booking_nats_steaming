import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "@dilutickets/common";
import { DatabaseConnectionError } from "@dilutickets/common";
import { User } from "../model/users";
import { BadRequestError } from "@dilutickets/common";
import jwt from "jsonwebtoken";
import { validateRequest } from "@dilutickets/common";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("hey", req.body);

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      throw new BadRequestError("email already in use");
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    return res.status(201).json(user);
  }
);

export { router as signupRouter };
