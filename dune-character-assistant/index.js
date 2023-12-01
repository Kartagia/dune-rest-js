/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const config = require("../private/firebase.config.json");

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

initializeApp();

const app = initializeApp(config);
const db = getFirestore(app);

exports.tst = onRequest({}, async (req, res) => {

});

/**
 * Function "addSkill?name&desc" adding a skill to the firestore.
 * @type {import("firebase-functions/v2/https").HttpsFunction}
 */
exports.addSkill = onRequest(async (req, res) => {
  const skillName = req.query.name;
  const skillDescription = req.query.desc;
  const re = new RegExp("^\\p{Lu}\\p{Ll}*$", "u");
  if (re.test(skillName)) {
    const skills = getFirestore().collection("skills").listDocuments;
    skills.then( (list) => {
      if (list.find((entry) => (entry.get("name")))) {
        res.sendStatus(400);
        res.send("The name is already reserved");
      } else {
        const writeResult = getFirestore().collection(db, "skills").add(
            {name: skillName, description: skillDescription});
        res.json({id: writeResult.id, result: `Skill "${skillName
        }" with ID ${writeResult.id} added`});
      }
    }, (error) => {
      logger.error("Could not retrieve list of skills.", error);
      res.sendStatus(400);
    });
  } else {
    res.sendStatus(400);
    res.send("Invalid skill name");
  }
});

exports.getSkill = onRequest(async (req, res) => {
  const id = req.query.id;
  const readResult = await getFirestore()
      .collection("skills").get(id);
  if (readResult) {
    logger.log(`Sending skill[${id}]=${readResult.name} to:`, req.ip);
    res.json(readResult);
  } else {
    logger.info("Attempt to access an undefined skill:", req.ip);
    res.sendStatus(404);
    res.json(null);
  }
});

/**
 * Logging the creation of a skill, and adding the creation time
 * to the skill.
 */
exports.checkskillexistenze = onDocumentCreated("/skills/{skillId}",
    (event) => {
      const data = event.data.data();
      logger.log(`Added skill[${event.params.skillId}]: ${data.name}`);
      return event.data.ref.set({created: (
        new Date()).toISOString()}, {merge: true});
    });
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
