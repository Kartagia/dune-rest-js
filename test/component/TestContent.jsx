import { useContext } from "react"
import SessionContext from "../../component/SessionContext"
import LogIn from "../../component/FirebaseLogin";


/**
 * Create a new test content
 * @param {import("react").PropsWithChildren} props 
 */
export default function TestContent(props)  {
  const session = useContext(SessionContext);
  if (session.isLoggedIn()) {
    return (<main>{props.children}</main>)
  } else {
    return (<main><LogIn/></main>)
  }
}