"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
const createToken = (uid) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ uid }, SECRET_KEY, { expiresIn: "12h" }, (err, token) => {
            if (err) {
                reject("Failed to generate the token");
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.createToken = createToken;
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                reject("Failed to verify the token");
            }
            else {
                resolve(decoded);
            }
        });
    });
};
exports.verifyToken = verifyToken;
