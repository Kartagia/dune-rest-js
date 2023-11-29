import admin from "firebase-admin";

var serviceAccount = require("../private/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dune-rpg-assistant-default-rtdb.europe-west1.firebasedatabase.app"
});