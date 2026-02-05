"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAuth = exports.firebaseDB = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let envVar = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!envVar) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set");
}
let serviceAccount;
try {
    serviceAccount = JSON.parse(envVar);
}
catch (err) {
    throw new Error("Invalid JSON in FIREBASE_SERVICE_ACCOUNT environment variable");
}
let firebaseApp;
try {
    const existingApps = firebase_admin_1.default.apps;
    if (existingApps.length === 0) {
        firebaseApp = firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
        });
    }
    else {
        firebaseApp = existingApps[0];
    }
}
catch (error) {
    throw error;
}
exports.firebaseDB = firebase_admin_1.default.firestore(firebaseApp);
exports.firebaseAuth = firebase_admin_1.default.auth(firebaseApp);
exports.default = firebase_admin_1.default;
