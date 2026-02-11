"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_helper_1 = require("../helper/jwt.helper");
const authMiddleware = async (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token no proporcionado",
            });
        }
        // El token viene en formato "Bearer <token>"
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Formato de token inválido",
            });
        }
        // Verificar el token
        const decoded = (await (0, jwt_helper_1.verifyToken)(token));
        // Guardar el uid en el request para usarlo en los controladores
        req.firestoreId = decoded.firestoreId;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token inválido o expirado",
        });
    }
};
exports.authMiddleware = authMiddleware;
