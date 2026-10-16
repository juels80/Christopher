import { useEffect, useState } from "react";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import Help from "./pages/Help.jsx";
import TabBar from "./components/TabBar.jsx";
import { SAMPLE_SUBS, sanitizeSubs, store } from "./lib/subscriptions.js";

export default function App() {
  const [user, setUser] = useState(() => store.get("subguard.user", null));
  const [subs, setSubs] = useState(() => {
    return sanitizeSubs(store.get("subguard.v1", null)) ?? SAMPLE_SUBS();
  });
  const [page, setPage] = useState(user ? "home" : "signup");

  useEffect(() => {
    store.set("subguard.v1", subs);
  }, [subs]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const signIn = (u) => {
    store.set("subguard.user", u);
    setUser(u);
    setPage("home");
  };
  const signOut = () => {
    // Data lives only in this browser, so signing out clears it for the next person.
    store.remove("subguard.user");
    store.remove("subguard.v1");
    setSubs(SAMPLE_SUBS());
    setUser(null);
    setPage("signup");
  };

  if (!user || page === "signup") return <SignUp onDone={signIn} />;

  return (
    <>
      {page === "home" && <Home user={user} subs={subs} setSubs={setSubs} onSignOut={signOut} />}
      {page === "help" && <Help />}
      <TabBar page={page} onChange={setPage} />
    </>
  );
}
