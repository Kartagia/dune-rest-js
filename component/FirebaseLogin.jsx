
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';

/**
 * @module firebaselogin
 * The module giving firebase login and registration
 * component.
 */

/**
 * A login component performing the login using Firebase.
 * @param {import("react").ReactPropTypes} props 
 * @returns {import("react").ReactElement} The created
 * react element.
 */
function FirebaseLogin(props) {
  /**
   * @type {[boolean, Function]}
   */
  const [loggedIn, setLoggedIn] = useState(props.loggedIn);
  const [userInfo, setUserInfo] = useState(props.userInfo);
  /**
   * @type {[Array<Error>, Function]}
   */
  const [errors, setErrors] = useState(props.errors || []);
  /**
   * @type {[boolean, Function]}
   */
  const [isOpen, setOpen] = useState(props.open || (!loggedIn && errors.length == 0));
  useEffect(() => {
    if (errors.length > 0) {
      // The login is in erroneus state - the login and userinfo 
      // is not updated.
    } else if (loggedIn) {
      // A successful login.
      setUserInfo(userInfo);
    } else {
      // A successful logout.
      // Logging out.
      setUserInfo(null);
    }
  }, [loggedIn, errors])
  /**
   * The current login state.
   * @returns {boolean} True, if and only if the login is successful
   */
  const isLoggedIn = () => {
    return userInfo != null;
  }
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
            setUserInfo(userCredential.user);
            setErrors([]);
            setLoggedIn(true);
          }
        ).catch(
          (error) => {
            const code = error.errorCode;
            const message = error.message;
            setErrors([code, `${message}`]);
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
              setUserInfo(user);
              setLoggedIn(true);
            })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

          });
      default:

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
}

export default FirebaseLogin;