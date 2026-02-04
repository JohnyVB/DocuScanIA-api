import dotenv from "dotenv";
import admin from "firebase-admin";
dotenv.config();

let envVar = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!envVar) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set");
}

let serviceAccount: any;
try {
    serviceAccount = JSON.parse(envVar);
} catch (err: any) {
    throw new Error(
        "Invalid JSON in FIREBASE_SERVICE_ACCOUNT environment variable",
    );
}

let firebaseApp: any;

try {
    const existingApps = admin.apps;
    if (existingApps.length === 0) {
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId:
                serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
        });
    } else {
        firebaseApp = existingApps[0];
    }
} catch (error: any) {
    throw error;
}

export const firebaseDB = admin.firestore(firebaseApp);
export const firebaseAuth = admin.auth(firebaseApp);
export default admin;
