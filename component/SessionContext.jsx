import { useState, createContext, useContext } from "react";
import ComplexErrorContext from "./ErrorContext";

/**
 * The user information placeholder.
 * @typedef {Object} UserInfo 
 * @property {string} displayName The name of the user.
 * @property {string} credential The user credential.
 * @property {string} user The user name of the user. This 
 * is usually user email.
 */

/**
 * @callback LogInPredicate
 * @returns {boolean} True, if and only if the session is logged in.
 * 
 * @callback SessionRefresher
 * @param {number|null} [idleTime=600000] The expiration time in milliseconds
 * from this moment. The value must be less than 1 hour. Defaulst to 10 minutes
 * of inaction.
 * @returns {Promise<number>} The updated refresh time. The promise may
 * fail due {@link RangeError} indicating the delta was not valid. 
 */
/** 
 * @template TYPE
 * @callback Setter
 * @description Asynchronoius setting of a value.
 * @param {TYPE} value The new value.
 * @returns {Promise<never>} The promise of the completion. 
 */

/**
 * @typedef {Object} SessionContextModel
 * @property {UserInfo} [userInfo] The user information of the
 * logged user.
 * @property {number} [expireTime] The expiration time of the
 * session.
 * @property {LogInPredicate} isLoggedIn The callback determining
 * whether the session has been logged in.
 * @property {SessionRefresher} refreshSession The callback refreshing
 * the current session.
 * @property {Setter<UserInfo>} setUserInfo The callback setting the user information.
 */

/**
 * The constant of the login context property.
 * @type {string}
 */
export const LOGIN_CONTEXT_PROPERTY = "login";

/**
 * The constant of the session timeout property.
 * @type {string}
 */
export const TIMEOUT_PROPERTY = "timeout";

/**
 * The constant of the user information property.
 * @type {string}
 */
export const USERINFO_PROPERTY = "userinfo";

/**
 * The credentials error property.
 * @type {string}
 */
export const CREDENTIALS_PROPERTY = "credentials";

/**
 * The user name error property.
 * @type {string}
 */
export const USER_PROPERTY = "user";

/**
 * The password error property.
 * @type {string}
 */
export const PASSWORD_PROPERTY = "password";



/**
 * The session context.
 * @type {import("react").Context<SessionContextModel>}
 */
const SessionContext = createContext({

  /**
   * The user information of the session.
   * @type {UserInfo?} The user information of
   * the logged user.
   */
  userInfo: null,
  /**
   * The expiration time of the session.
   * @type {number?}
   */
  expireTime: null,

  /**
   * Is the session logged in.
   * @method
   * @returns {boolean} True, if and only if
   * the session is logged in.
   */
  isLoggedIn: () => {
    return !(this.userInfo == null || this.expireTime == null || Date.now() >= this.expireTime);
  },

  /**
   * Refresher callback of the session.
   * @type {SessionRefresher}
   * @returns {Promise<never>} The promise of the completion of 
   * the update. 
   * @throws {RangeError} The time out is an invalid value, and
   * no error context exists. If error context exists, this error
   * is sent as rejection with target [
   * {@link LOGIN_CONTEXT_PROPERTY}, {@link TIMEOUT_PROPERTY}
   * ]
   */
  refreshSession: (idleTime = 600000) => {
    return new Promise((respond, reject) => {
      if (idleTime === null) {
        this.expireTime = idleTime;
        respond(this.expireTime);
      } else if (!Number.isInteger(idleTime)) {
        reject(new TypeError("Invalid idle time"));
      } else if (idleTime > (10 * 60 * 60 * 1000)) {
        reject(new RangeError("Invalid idle time"));
      } else {
        this.expireTime = Date.now() + idleTime;
        respond(this.expireTime);
      }
    });
  },
  /**
   * Update the user information.
   * @method
   * @param {UserInfo|null} newUserData The new user data. 
   * @returns {Promise<never>} The promise of the operation completion.
   * @throws {TypeError} The given user data was invalid.
   * If the error context is defined, the error is not thrown, but delivered
   * with promise rejection error definition with target
   * [{@link LOGIN_CONTEXT_PROPERTY}, {@link USERINFO_PROPERTY}]. 
   */
  setUserInfo: (newUserData) => {
    this.userInfo = newUserData;
    return Promise.respond();
  },

})

/**
 * The session context provider creating context
 * boundary.
 * @param {import("react").PropsWithChildren} props 
 * @returns {imoprt("react").ReactElement} The created element.
 */
export function SessionContextProvider(props) {
  const errors = useContext(ComplexErrorContext);
  /**
   * @type {[UserInfo|null, import("react").Dispatch<SetStateAction<UserInfo|null>>]}
   */
  const [userData, setUserData] = /**
  @type {import("react").Dispatch<SetStateAction<(UserInfo|null)>>} */ useState(null);
  /**
   * @type {[number|null, import("react").Dispatch<SetStateAction<number|null>>]}
   */
  const [expireTime, setExpireTime] = /** 
  @type {import("react").Dispatch<SetStateAction<number|null>>} */ useState(null);

  /**
   * The handler handling the logged in status.
   * @return {Promise<boolean>} The promise of the logged in
   * status.
   */
  const isLoggedInHandler = () => {
    const now = Date.now();
    return Promise.resolve(userData != null && expireTime != null &&
      now < expireTime);
  }

  /**
   * Update the exmpiration time.
   * @param {number|null} [idleTime=600000] The amount of seconds until expiration.
   * Dfeaults to 10 minutes.
   * @returns {Promise<never>} The promise of the operation completion. 
   * @throws {RangeError} The expiration time is invalid. The system does not
   * allow greater expiration time than 1 hour.
   * If errors context is defined, the error is returned as error definition
   * at context [{@link LOGIN_CONTEXT_PROPERTY}, {@link TIMEOUT_PROPERTY}]
   */
  const expireTimeHandler = (idleTime = 600000) => {
    return new Promise((respond, reject) => {
      if (idleTime == null) {
        // Performing immediate expiration.
        setExpireTime(null);
        respond(null);
      } else if (Number.isInteger(idleTime) && idleTime < 3600000) {
        // Setting the expiration time.
        const expireTime = Date.now() + idleTime;
        setExpireTime(Date.now() + idleTime);
        respond(expireTime);
      } else {
        // Invalid value.
        const error = new RangeError("Invalid session expiration time");
        if (errors) {
          reject(errors.createErrorDefinition(
            [LOGIN_CONTEXT_PROPERTY, TIMEOUT_PROPERTY], error))
        } else {
          reject(error);
        }
      }
    })
  }

  /**
   * The handler setting the state of the user data and
   * refreshing the React application accordingly.
   * @param {UserInfo} newUserData The new user data.
   * @returns {Promise<never>} The promise of the completion.
   * @throws {TypeError} The given user data was invalid, and no error
   * is sent as rejection with target [
   * {@link LOGIN_CONTEXT_PROPERTY}, {@link TIMEOUT_PROPERTY}
   * ]
   */
  const setUserDataHandler = (newUserData) => {
    if (newUserData == null) {
      // The user data is removed and the session is
      // expired.
      setUserData(null);
      return Promise.respond();
    } else if (newUserData instanceof Object) {
      // The data is fine.
      setUserData(newUserData);
      return Promise.respond();
    } else {
      // The user data is not an object.
      const error = new TypeError("Invalid user data");
      if (errors) {
        return Promise.reject(errors.createErrrorDefiniton(
          [LOGIN_CONTEXT_PROPERTY, USERINFO_PROPERTY], error
        ));
      } else {
        return Promise.reject(error);
      }
    }
  }

  /**
   * @private
   * The internal context of the provider.
   */
  const context = {
    /**
     * The snapshot of the user data.
     * @type {UserInfo|null}
     */
    userData: /** @type {UserInfo|null} */ userData,
    /**
     * The snapshot of the expiration time in
     * milliseconds.
     * @type {number|null}
     */
    expireTime,
    /**
     * Update the session expiration.
     * @method
     * @param {number|null} [timeOut=600000] The time session
     * is still active. Too large deltas are not allowed.
     * A positive infinity indicates no timeout.
     * @throws {RangeError} The time out is an invalid value, and
     * no error context exists. If error context exists, this error
     * is sent as rejection with target "login.updateSession".
     */
    refreshSession: expireTimeHandler,
    /**
     * Update the user information.
     * @method
     * @param {UserInfo|null} newUserData The new user data. 
     * @returns {Promise<never>} The promise of the operation completion.
     * @throws {TypeError} The given user data was invalid, and no error
     * is sent as rejection with target [
     * {@link LOGIN_CONTEXT_PROPERTY}, {@link TIMEOUT_PROPERTY}
     * ]
     */
    setUserInfo: setUserDataHandler,
    /**
     * Is the session still logged in.
     * @method
     * @returns {Promise<boolean>} The promise of the true
     * value if and only if the session is still active.
     */
    isLoggedIn: isLoggedInHandler
  }

  return (<SessionContext.Provider value={context}>
    {props.children}
  </SessionContext.Provider>)
}


export default SessionContext;