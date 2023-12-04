import { useContext } from "react"
import SessionContext from "../../component/SessionContext"
import ComplexErrorContext from "../../component/ErrorContext";


/**
 * Create a new test footer.
 * @param {import("react").PropsWithChildren} props 
 */
export default function(props)  {
  const session = useContext(SessionContext);
  const errors = useContext(ComplexErrorContext);
  return (<footer>
    <section className="errors">{( errors.hasErrors("") ? errors.getErrors("").map(
      (errorDef, index) => {
        return (<article key={`${errorDef.target}.${index}`}>{errorDef.message}</article>)
      }
    ) : [])}</section>
    <section>{session.isLoggedIn() ? `${session.userInfo.displayName}` : ""}</section>
    <section>{props.children}</section></footer>)
}