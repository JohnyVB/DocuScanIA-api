"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const document_controller_1 = require("../controllers/document.controller");
const router = (0, express_1.Router)();
router.get("/allByIdUser", auth_middleware_1.authMiddleware, document_controller_1.allDocumentsByIdUser);
exports.default = router;
