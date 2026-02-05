import { Router } from "express";
import {
  login,
  newUser,
  resetPassword,
  sendResetPasswordCode,
  verifyResetPasswordCode,
} from "../controllers/access.controller";

const router = Router();

router.post("/login", login);
router.post("/newUser", newUser);
router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/verifyResetPasswordCode", verifyResetPasswordCode);
router.post("/resetPassword", resetPassword);

export default router;
