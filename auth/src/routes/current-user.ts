import express from 'express';
import { CurrentUser } from '@dilutickets/common';

const router = express.Router();

router.get('/api/users/currentuser', CurrentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
