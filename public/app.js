import { useState } from "react";
import config from "../private/firebase.config.json";
import Menu from "../component/Menu.jsx";
import DuneContent from "../component/DuneContent.jsx";
import { SessionContextProvider } from "../component/SessionContext.jsx";
import { ErrorContextProvider } from "../component/ErrorContext.jsx";
import LogIn from "../component/FirebaseLogin.jsx";
import { DuneAppContextProvider } from "../component/FirebaseContext.jsx";
import TestHeader from "../test/TestHeader.jsx";
import TestContent from "../test/TestContent.jsx";
import TestFooter from "../test/TestFooter.jsx";

/**
 * @param {import("firebase/app").FirebaseApp} from "firebase";
 */
function App(firebaseApp) {
  return (
    <ErrorContextProvider>
      <SessionContextProvider>
        <DuneAppContextProvider>
          <section id="reactApp" className="reactApp">
            <TestHeader></TestHeader>
            <TestContent></TestContent>
            <TestFooter></TestFooter>
          </section>
        </DuneAppContextProvider>
      </SessionContextProvider>
    </ErrorContextProvider>
  );
}
if (location.hostname === "localhost") {
  config.databaseUrl = "http://localhost:8082?ns=emulatorui";
}
