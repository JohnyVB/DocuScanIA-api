import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

export const createToken = (uid: string) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ uid }, SECRET_KEY, { expiresIn: "12h" }, (err, token) => {
            if (err) {
                reject("Failed to generate the token");
            } else {
                resolve(token);
            }
        });
    });
};

export const verifyToken = (token: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                reject("Failed to verify the token");
            } else {
                resolve(decoded);
            }
        });
    });
};
