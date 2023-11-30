import { useState, createContext } from "react";

/**
 * The user information placeholder.
 * @typedef {Object} UserInfo 
 */

/**
 * @typedef {Object} SessionContextModel
 * @property {UserInfo} [userInfo] The user information of the
 * logged user.
 * @property {number} [expireTime] The expiration time of the
 * session.
 * @method isLoggedIn()
 * @returns {boolean} True, if and only if the session is logged in.
 */

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
  isLoggedIn() {
    return false;
  },

  /**
   * Refreshes the session updating the expiret time.
   * @returns {number} The updated expire time.
   */
  refreshSession() {
    return this.expireTime;
  }
})

/**
 * The session context provider creating context
 * boundary.
 * @param {import("react").PropsWithChildren} props 
 * @returns {imoprt("react").ReactElement} The created element.
 */
export function SessionContextProvider(props) {
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
   * @param {number|null} [delta=600000] The amount of seconds until expiration.
   * Dfeaults to 10 minutes. 
   * @throws {RangeError} The expiration time is invalid. The system does not
   * allow greater expiration time than 1 hour. 
   */
  const expireTimeHandler = (delta=600000) => {
    if (delta == null) {
      // Performing immediate expiration.
      setExpireTime(null);
    } else if (Number.isInteger(delta) && delta < 3600000) {
      // Setting the expiration time.
      setExpireTime(Date.now() + delta);
    } else {
      // Invalid value.
      throw new RangeError("Invalid session expiration time");
    }
  }

  /**
   * The handler setting the state of the user data and
   * refreshing the React application accordingly.
   * @param {UserInfo} newUserData The new user data.
   */
  const setUserDataHandler = (newUserData) => {
    if (newUserData == null) {
      // The user data is removed and the session is
      // expired.
      setUserData(null);
    } else if (newUserData instanceof Object) {
      // The data is fine.
      setUserData(newUserData);
    } else {
      // The user data is not an object.
      throw new TypeError("Invalid user data");
    }
  }

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
     * @param {number|null} [delta=600000] The time session
     * is still active. Too large deltas are not allowed.
     * @throws {RangeError} The delta is a valid value.
     */
    updateSession: expireTimeHandler,
    /**
     * Update the user information.
     * @method
     * @param {UserInfo|null} newUserData The new user data. 
     * @throws {TypeError} The given user data was invalid.
     */
    setUserData: setUserDataHandler,
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