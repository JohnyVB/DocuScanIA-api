import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  allDocumentsByUserId,
  hideDocumentByDocumentUid,
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
router.get("/documentsByUserId", authMiddleware, allDocumentsByUserId);
router.post(
  "/hideDocumentByDocumentUid",
  authMiddleware,
  hideDocumentByDocumentUid,
);

export default router;
