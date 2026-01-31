import { Router } from "express";
import { allDocumentsByIdUser } from "../controllers/document.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/allByIdUser", authMiddleware, allDocumentsByIdUser);

export default router;
