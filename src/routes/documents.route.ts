import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  allDocumentsByIdUser,
  uploadDocument,
} from "../controllers/document.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post(
  "/uploadDocument",
  authMiddleware,
  upload.array("images", 10),
  uploadDocument,
);
router.get("/documentsByUserId", authMiddleware, allDocumentsByIdUser);

export default router;
