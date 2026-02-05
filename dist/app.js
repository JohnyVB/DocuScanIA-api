"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./src/config/firebase.config");
const nodemailer_config_1 = __importDefault(require("./src/config/nodemailer.config"));
const access_route_1 = __importDefault(require("./src/routes/access.route"));
const documents_route_1 = __importDefault(require("./src/routes/documents.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Rutas
app.use("/api/access", access_route_1.default);
app.use("/api/documents", documents_route_1.default);
const PORT = process.env.PORT || 3000;
nodemailer_config_1.default.verify((error, success) => {
    if (error) {
        console.error("❌ Error conectando con Gmail:", error);
    }
    else {
        console.log("✅ Nodemailer conectado correctamente a Gmail");
    }
});
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
