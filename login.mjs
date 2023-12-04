import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

/**
 * Login.
 * @returns {Promise<UserInfo>}
 */
export async function login() {
  const provider = new GoogleAuthProvider();

  const auth = getAuth();
  await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      alert(`Logged in as ${user.userId} of ${user.email}`)
      // TODO: create cookie
      return Promise.resolve(user.userId);
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      reject(["user", null, `Could not login with ${email} `])
    });
} // login


login().then((userId) => main(userId)).catch((error) => {
  const htmlMessage = document.createElement("section");
  htmlMessages.class = "error";
  htmlMessages.appendChild(document.createTextNode`Login failed due ${error.name}: ${error.message}`);
  document.getElementById("content").appendChild(htmlMessage)
})