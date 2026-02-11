"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const document_controller_1 = require("../controllers/document.controller");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
router.post("/uploadDocument", auth_middleware_1.authMiddleware, upload.array("images", 10), document_controller_1.uploadDocument);
router.get("/documentsByUserId", auth_middleware_1.authMiddleware, document_controller_1.allDocumentsByUserId);
router.put("/hideDocumentById", auth_middleware_1.authMiddleware, document_controller_1.hideDocumentById);
exports.default = router;
