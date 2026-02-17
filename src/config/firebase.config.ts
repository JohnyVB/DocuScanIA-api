import admin from "firebase-admin";
import env from "./env";

const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT || "{}");

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

export const firebaseDB = admin.firestore(firebaseApp);
export const firebaseAuth = admin.auth(firebaseApp);
export default admin;
