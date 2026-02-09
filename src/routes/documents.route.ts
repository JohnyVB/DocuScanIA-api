import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  allDocumentsByIdUser,
  uploadDocument,
} from "../controllers/document.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/allByIdUser", authMiddleware, allDocumentsByIdUser);
router.post(
  "/uploadDocument",
  authMiddleware,
  upload.array("images", 10),
  uploadDocument,
);

export default router;
