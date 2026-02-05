import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { allDocumentsByIdUser } from "../controllers/document.controller";

const router = Router();

router.get("/allByIdUser", authMiddleware, allDocumentsByIdUser);

export default router;
