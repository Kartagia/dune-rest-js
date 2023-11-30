import {useState} from "react";
import config from "../private/firebase.config.json";
import Menu from "../component/Menu.jsx";
import DuneContent from "../component/DuneContent.jsx";
import { SessionContextProvider } from "../component/SessionContext.jsx";
import {ErrorContextProvider} from "../component/ErrorContext.jsx";
import LogIn from "../component/FirebaseLogin.jsx";
import { DuneAppContextProvider } from "../component/DuneAppContext.jsx";


/**
 * @param {import("firebase/app").FirebaseApp} from "firebase";
 */
function App(firebaseApp) {
  const [loggedIn, setLoggedIn] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const appStatus = useRef();
  useEffect( () => {
    if (appStatus.current) {
      appStatus.current.textContent = (isLoading ? "Loading...." : "Up and running");
    }
  }, [isLoading])

  const header = (loggedIn ? (<Menu onLoggout={(event) => {setLoggedIn(false);}}></Menu>) : <></>)
  const content = (loggedIn ? (<DuneContent></DuneContent>) : (<Login/>));
  const footer = (isLoading ? (<span ref={appStatus} className={"footer"}>Loading...</span>)
  : "");

  return (<ErrorContextProvider><SessionContextProvider><DuneAppContextProvider>
    <section>
    <header>{header && header}</header>
    <main>{content}</main>
    <footer>{footer && footer}</footer>
  </section>
  </DuneAppContextProvider></SessionContextProvider></ErrorContextProvider>
  )
}
if (location.hostname === "localhost") {
  config.databaseUrl = "http://localhost:8082?ns=emulatorui";
}
