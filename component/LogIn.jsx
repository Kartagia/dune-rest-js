
/**
 * @module LogIn The default password based login component.
 */

/**
 * A login component performing the login.
 * @param {import("react").ReactPropTypes} props 
 * @returns {import("react").ReactElement} The created
 * react element.
 */
function LogIn(props)  {
  return (<form action="">
  <label for="name">Username</label><input type="text" name="user"
  id="name"
  placeholder="Enter username"></input>
  <label for="secret">Password</label><input type="password" name="secret"
  id="secret"
  placeholder="Enter your password"></input>
  <input type="submit" name="LogIn" value="Log">Log In</input>
  <input type="button" name="Register" value="Register">Register</input>
  
</form>)
}

export default LogIn;