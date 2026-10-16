import { useEffect, useState } from "react";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import Help from "./pages/Help.jsx";
import TabBar from "./components/TabBar.jsx";
import { SAMPLE_SUBS, store } from "./lib/subscriptions.js";

export default function App() {
  const [user, setUser] = useState(() => store.get("subguard.user", null));
  const [subs, setSubs] = useState(() => {
    const saved = store.get("subguard.v1", null);
    return Array.isArray(saved) ? saved : SAMPLE_SUBS();
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
    store.remove("subguard.user");
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
