/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.duneApp = onRequest((request, response) => {
  const title = "Dune Character Assistant (Testing)";
  logger.info(title,
      {structuredData: true});
  response.send(`<html><head>
    <title>${title}</title>
    <style>
        body {
            background-color: deeppurple;
            color: green;
        }
    </style>
    </head><body><h1>${title}</h1></body></html>`);
});

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
