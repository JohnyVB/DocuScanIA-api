import { Router } from "express";
import { newUser, login } from "../controllers/access.controller";

const router = Router();

router.post("/login", login);
router.post("/newUser", newUser);

export default router;
