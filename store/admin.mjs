import admin from "firebase-admin";

var serviceAccount = require("../private/serviceAccountKey.json");

/**
 * Perform admin login to the Firebase.
 * @param {string} [databaseUrl] The database url of the data storage.
 * Defaults to the default database url.
 */
export function adminLogin(databaseUrl = "https://dune-rpg-assistant-default-rtdb.europe-west1.firebasedatabase.app") {
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseUrl
});
}