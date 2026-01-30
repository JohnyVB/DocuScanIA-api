import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

let serviceAccount: any;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON");
    }
} else {
    // Fallback to local service account file at project root
    const filePath = path.resolve(
        __dirname,
        "..",
        "..",
        "serviceAccountKey.json",
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    serviceAccount = require(filePath);
}

let firebaseApp: any;

try {
    const existingApps = admin.apps;
    if (existingApps.length === 0) {
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id,
        });
    } else {
        firebaseApp = existingApps[0];
    }
} catch (error: any) {
    throw error;
}

// Export services using the initialized app instance
export const firebaseDB = admin.firestore(firebaseApp);
export const firebaseAuth = admin.auth(firebaseApp);
export default admin;
