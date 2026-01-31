import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helper/jwt.helper";

// Extender el tipo de Request para incluir el uid del token
declare global {
    namespace Express {
        interface Request {
            uid?: string;
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
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
        const decoded = (await verifyToken(token)) as { uid: string };

        // Guardar el uid en el request para usarlo en los controladores
        req.uid = decoded.uid;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token inválido o expirado",
        });
    }
};
