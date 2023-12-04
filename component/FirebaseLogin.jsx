
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { useContext, useId, useRef, useState } from 'react';
import SessionContext, { LOGIN_CONTEXT_PROPERTY, USERINFO_PROPERTY,
CREDENTIALS_PROPERTY } from './SessionContext';
import ComplexErrorContext, { ComplexErrorContextProvider } from './ErrorContext';
import logger from console.log;

/**
 * @module firebaselogin
 * The module giving firebase login and registration
 * component.
 */

/**
 * The registration error context property.
 * @type {string}
 */
export const REGISTER_CONTEXT_PROPERTY = "register";


/**
 * A login component with username and password.
 * @param {import("react").ReactPropTypes} props 
 */
export function Login(props) {
  const session = useContext(SessionContext);
  const errors = useContext(ComplexErrorContext);
  /**
   * @type {[boolean, Function]}
   */
  const [isOpen, setOpen] = useState(props.open || (!session.isLoggedIn() && errors.length == 0));
  const auth = getAuth();

  /**
   * Handler of a login form submit.
   * @param {SubmitEvent} event THe login event.
   * @returns {ErrorInfo|import('@firebase/auth').UserInfo} The error 
   * information of the failed login, or the logged user information.
   */
  const loginHandler = (event) => {
    // Preventing the default submission.
    event.preventDefault();

    // Getting the username and the action.
    switch (event.submitter.name) {
      case "Register":
        // Performing registration.
        createUserWithEmailAndPassword(
          auth,
          event.target.user.value,
          event.target.secret.value
        ).then(
          (userCredential) => {
            // Signed in
            const userInfo = {
              displayName: userCredential.user.displayName || (<i>Anonymous User</i>),
              fireabaseTokenId: userCredential.user.getIdToken()
            };
            session.setUserInfo(userInfo);
            errors.clearErrors(REGISTER_CONTEXT_PROPERTY);
          }
        ).catch(
          (error) => {
            // TODO: Add handling of a message with the email already
            // reserved.
            const message = error.message;
            errors.addError(errors.createErrorDefinition(
              [REGISTER_CONTEXT_PROPERTY, CREDENTIALS_PROPERTY], 
            error, `Invalid user credentials: ${message}`
            ));
          }
        )
      case "LogIn":
        // Performing login
        signInWithEmailAndPassword(
          auth,
          event.target.user.value,
          event.target.secret.value).then(
            (userCredential) => {
              // Signed in
              /**
               * @type {import('@firebase/auth').UserInfo}
               */
              const user = userCredential.user;
              session.setUserInfo(user).then( () => {
                return session.refreshSession();
              }).catch(errorDef => {
                errors.addError(
                  [LOGIN_CONTEXT_PROPERTY, USERINFO_PROPERTY, 
                  ...(errorDef.target||[])], errorDef.error, 
                  errorDef.message);
              });
            })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            errors.addError(errors.createErrorDefinition(
              [LOGIN_CONTEXT_PROPERTY, CREDENTIALS_PROPERTY], 
            error, `Invalid user credentials: ${message}`
            ));

          });
      default:
          // The unknown submission.
          logger.error("Attempt to submit form with invalid submission attribute")
          errors.addError([LOGIN_CONTEXT_PROPERTY], 
            Error("Invalid form submission"), "Something went wrong...")
    }
  };

  if (isOpen) {
    // Return the login form.
    // TODO: Add login with Google etc. support
    return (<form onSubmit={loginHandler}>
      <label for="name">Username</label><input type="text" name="user"
        id="name"
        placeholder="Enter username"></input>
      <label for="secret">Password</label><input type="password" name="secret"
        id="secret"
        placeholder="Enter your password"></input>
      <input type="submit" name="LogIn" value="Log">Log In</input>
      <input type="button" name="Register" value="Register">Register</input>

    </form>)
  } else {
    // The component is empty, if it is closed.
    return (<></>);
  }
}

/**
 * A login component performing the login using Firebase.
 * @param {import("react").ReactPropTypes} props 
 * @returns {import("react").ReactElement} The created
 * react element.
 */
function FirebaseLogin(props) {
  /**
   * Teh reference of the login eleement placeholder.
   * @type {(import('react').MutableRefObject<import('react').ReactElement|
   * import('react').ReactHTMLElement)}
   */
  const ref = useRef();
  useEffect(() => {
    // Adding the authentication change handler.
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // The user is signed in.
        if (props.onLogin) {
          props.onLogin(user);
        }
        setLoggedIn(true);
      } else {
        // Produce login
        if (props.onLogout) {
          props.onLoggout(user);
        }
        setLoggedIn(false);
      }
    });
  }, []);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const signIn = async (auth, provider) => {
  signInWithPopup(auth, provider).then(
    (credentials) => {
      ref.current.classList.add("hidden");
      return credentials;
    },
    (error) => {
      logger.error(`[Code: ${error.code}][${error.user}]: Login failed: ${error.code}: ${error.message}: `);
      ref.current.textConent = "<p>Login failed: " + error.message + ". Click to retry.</p>";
      ref.current.addEventListener("click", () => {
        signIn(auth, provider);
      })
      this(auth, provider);
    }
  )
  };
  signIn(auth, provider);
  return () => {
    <div ref={ref}>LoggingIn</div>
  }
}

export default FirebaseLogin;