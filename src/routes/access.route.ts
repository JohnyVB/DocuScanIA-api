import { Router } from "express";
import {
  newUser,
  login,
  sendResetPasswordCode,
  verifyResetPasswordCode,
  resetPassword,
} from "../controllers/access.controller";

const router = Router();

router.post("/login", login);
router.post("/newUser", newUser);
router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/verifyResetPasswordCode", verifyResetPasswordCode);
router.post("/resetPassword", resetPassword);

export default router;
