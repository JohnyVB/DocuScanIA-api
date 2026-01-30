import admin from "firebase-admin";
import path from "path";

const filePath = path.resolve(__dirname, "..", "..", "serviceAccountKey.json");
const serviceAccount = require(filePath);

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
