import admin from "firebase-admin";

import serviceAccount from "../private/serviceAccountKey.json";

import appInfo from "../private/appInfo.json";

/**
 * Perform admin login to the Firebase.
 * @param {string} [databaseUrl] The database url of the data storage.
 * Defaults to the default database url.
 * @returns {import("firebase/app").FirebaseApp} The firebase application
 * with admin login.
 */
export function adminLogin(databaseUrl = appInfo.databaseUrl) {
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseUrl
  });
}